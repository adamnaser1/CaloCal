import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format, addDays, subDays, isSameDay, startOfDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Plus, Trash2, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMealLogsForDate, deleteMealItem, MealLog, MealItem } from "@/services/diaryService";
import { getUserProfile } from "@/services/profileService";
import { Link } from "react-router-dom";
import EmptyState from "@/components/EmptyState";
import BottomNav from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { formatCalories } from "@/lib/utils";
import FAB from "@/components/FAB"; // Reusing FAB component

// Helper to get emoji for meal item
const getEmoji = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("apple")) return "🍎";
    if (lower.includes("banana")) return "🍌";
    if (lower.includes("burger")) return "🍔";
    if (lower.includes("pizza")) return "🍕";
    if (lower.includes("salad")) return "🥗";
    if (lower.includes("coffee")) return "☕";
    if (lower.includes("egg")) return "🥚";
    if (lower.includes("chicken")) return "🍗";
    if (lower.includes("rice")) return "🍚";
    return "🍽️";
};

const DiaryScreen = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Date strip generation
    const dates = useMemo(() => Array.from({ length: 7 }, (_, i) => {
        const d = subDays(new Date(), 3 - i);
        return d;
    }), []);

    // Fetch meals
    const { data: mealLogs, isLoading: mealsLoading, refetch } = useQuery({
        queryKey: ["meals", startOfDay(selectedDate).toISOString()],
        queryFn: () => getMealLogsForDate(selectedDate),
    });

    // Fetch profile for goals
    const { data: profile } = useQuery({
        queryKey: ["profile"],
        queryFn: getUserProfile,
    });

    // Delete mutation
    const deleteItemMutation = useMutation({
        mutationFn: deleteMealItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["meals"] });
            toast({ description: "Item deleted", duration: 3000 });
        },
        onError: () => {
            toast({ variant: "destructive", description: "Failed to delete item", duration: 5000 });
        },
    });

    const [refreshing, setRefreshing] = useState(false);
    const handleRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setTimeout(() => setRefreshing(false), 1000);
    };

    // Calculate totals
    const totals = useMemo(() => mealLogs?.reduce(
        (acc, log) => ({
            calories: acc.calories + log.total_calories,
            proteins: acc.proteins + log.total_proteins,
            carbs: acc.carbs + log.total_carbs,
            fats: acc.fats + log.total_fats,
        }),
        { calories: 0, proteins: 0, carbs: 0, fats: 0 }
    ) || { calories: 0, proteins: 0, carbs: 0, fats: 0 }, [mealLogs]);

    const dailyGoal = profile?.daily_calorie_goal || 2000;
    const progress = Math.min(totals.calories / dailyGoal, 1) * 100;
    const ringColor = totals.calories > dailyGoal ? "border-orange-500" : (totals.calories / dailyGoal >= 0.8 ? "border-yellow-400" : "border-green-500");

    // Meal sections
    const sections = ["Breakfast", "Lunch", "Dinner", "Snack"];

    return (
        <motion.div
            className="min-h-screen bg-background pb-24"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={() => (document.activeElement as HTMLElement)?.blur()}
        >
            {/* Top Section */}
            <div className="bg-white pb-4 pt-6 shadow-sm">
                <div className="px-5 flex justify-between items-center">
                    <h1 className="mb-4 font-display text-2xl font-bold text-foreground">My Diary</h1>
                    <button
                        onClick={handleRefresh}
                        className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-secondary/80 active:scale-95"
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                    </button>
                </div>

                {/* Date Strip */}
                <div className="flex gap-2 overflow-x-auto px-5 pb-2 scrollbar-hide">
                    {dates.map((date) => {
                        const isSelected = isSameDay(date, selectedDate);
                        const isToday = isSameDay(date, new Date());

                        return (
                            <button
                                key={date.toISOString()}
                                onClick={() => setSelectedDate(date)}
                                className={`flex min-w-[60px] flex-col items-center rounded-2xl py-3 transition-colors ${isSelected
                                    ? "bg-[#F5C518] text-foreground"
                                    : "bg-gray-50 text-muted-foreground"
                                    }`}
                            >
                                <span className={`text-[10px] font-bold uppercase ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                                    {format(date, "EEE")}
                                </span>
                                <span className={`text-lg font-bold ${isSelected ? "text-foreground" : "text-gray-700"}`}>
                                    {format(date, "d")}
                                </span>
                                {/* Dot for today/selected decoration */}
                                {isToday && !isSelected && (
                                    <div className="mt-1 h-1 w-1 rounded-full bg-[#F5C518]" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="px-5 pt-6">
                {/* Daily Summary Card */}
                {mealsLoading ? (
                    <SkeletonLoader variant="card" className="mb-8 h-28" />
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 rounded-2xl bg-[#F5C518] p-5 text-foreground shadow-lg shadow-yellow-500/20"
                    >
                        <div className="flex items-center justify-between">
                            {/* Simple Ring Placeholder */}
                            <div className={`relative flex h-14 w-14 items-center justify-center rounded-full border-4 bg-white/10 ${totals.calories > dailyGoal ? 'border-orange-500/50' : 'border-white/30'}`}>
                                <div className="text-xs font-bold">
                                    {Math.round(progress)}%
                                </div>
                            </div>

                            <div className="flex flex-col items-center">
                                <span className="font-display text-xl font-bold">
                                    {formatCalories(totals.calories)} / {formatCalories(dailyGoal)} kcal
                                </span>
                                <span className="text-xs font-medium opacity-80">Daily Goal</span>
                            </div>

                            <div className="flex flex-col gap-1 text-xs font-medium">
                                <span>P: {Math.round(totals.proteins)}g</span>
                                <span>C: {Math.round(totals.carbs)}g</span>
                                <span>F: {Math.round(totals.fats)}g</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Meal Sections */}
                <div className="flex flex-col gap-6">
                    {mealsLoading ? (
                        <div className="space-y-6">
                            <SkeletonLoader variant="card" count={4} />
                        </div>
                    ) : (
                        sections.map((section, index) => {
                            const sectionLogs = mealLogs?.filter(
                                (log) => log.meal_type.toLowerCase() === section.toLowerCase()
                            );

                            const sectionTotal = sectionLogs?.reduce((sum, log) => sum + log.total_calories, 0) || 0;
                            const sectionItems = sectionLogs?.flatMap((log) => log.meal_items) || [];

                            return (
                                <motion.div
                                    key={section}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">
                                                {section === "Breakfast" ? "🌅" :
                                                    section === "Lunch" ? "☀️" :
                                                        section === "Dinner" ? "🌙" : "🍎"}
                                            </span>
                                            <h2 className="font-display text-base font-bold text-foreground">{section}</h2>
                                        </div>
                                        <span className={`text-sm font-bold ${sectionTotal > 0 ? "text-foreground" : "text-muted-foreground"}`}>
                                            {sectionTotal > 0 ? `${formatCalories(sectionTotal)} kcal` : ""}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        {sectionItems.length > 0 ? (
                                            sectionItems.map((item, i) => (
                                                <MealItemRow
                                                    key={item.id}
                                                    item={item}
                                                    onDelete={() => deleteItemMutation.mutate(item.id)}
                                                    onClick={() => navigate(`/diary/meal/${item.meal_log_id}`)}
                                                />
                                            ))
                                        ) : (
                                            <EmptyState
                                                emoji="🥣"
                                                title="Nothing logged yet"
                                                subtitle={`Snap your first ${section.toLowerCase()} to get started!`}
                                                primaryAction={{
                                                    label: "📷 Snap a meal",
                                                    onClick: () => navigate("/capture")
                                                }}
                                                secondaryAction={{
                                                    label: "Log manually",
                                                    onClick: () => { } // Stub
                                                }}
                                            />
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>

            <BottomNav />
            {/* FAB */}
            <FAB onClick={() => navigate("/capture")} />
        </motion.div>
    );
};

const MealItemRow = ({ item, onDelete, onClick }: { item: MealItem; onDelete: () => void; onClick: () => void }) => {
    return (
        <motion.div
            className="relative overflow-hidden rounded-xl bg-white shadow-sm"
            initial={false}
            layout
        >
            <motion.div
                className="absolute inset-y-0 right-0 flex w-20 items-center justify-center bg-red-500"
            >
                <Trash2 className="text-white" size={20} />
            </motion.div>

            <motion.div
                drag="x"
                dragConstraints={{ left: -80, right: 0 }}
                dragElastic={0.1}
                onDragEnd={(_, info) => {
                    if (info.offset.x < -60) {
                        onDelete();
                    }
                }}
                onClick={onClick}
                className="relative flex items-center justify-between bg-white p-4"
                style={{ cursor: "pointer" }}
            >
                <div className="flex items-center gap-4">
                    <span className="text-2xl">{getEmoji(item.custom_name)}</span>
                    <div>
                        <h3 className="font-display text-[15px] font-bold text-foreground truncate max-w-[150px]">{item.custom_name}</h3>
                        <p className="font-body text-xs text-muted-foreground">
                            {item.quantity_g}g · {formatCalories(item.calories)} kcal
                        </p>
                    </div>
                </div>
                <span className="font-display text-[15px] font-bold text-foreground">
                    {formatCalories(item.calories)}
                </span>
            </motion.div>
        </motion.div>
    );
};

export default DiaryScreen;
