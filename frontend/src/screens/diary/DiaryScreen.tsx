import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RefreshCw, Trash2, Loader2, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";
import { formatCalories } from "@/lib/utils";
import FAB from "@/components/FAB";
import { deleteMealItem } from "@/services/diaryService";

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

const getMealTypeDisplay = (mealType: string) => {
    const types: Record<string, { icon: string, label: string }> = {
        breakfast: { icon: '🌅', label: 'Breakfast' },
        lunch: { icon: '☀️', label: 'Lunch' },
        dinner: { icon: '🌙', label: 'Dinner' },
        snack: { icon: '🍎', label: 'Snack' }
    }
    return types[mealType?.toLowerCase()] || types.snack
}

const DiaryScreen = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [allMeals, setAllMeals] = useState<any[]>([]);
    const [displayedMeals, setDisplayedMeals] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const MEALS_PER_PAGE = 20;

    // Load all meals
    useEffect(() => {
        loadAllMeals();
    }, []);

    const loadAllMeals = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('meal_logs')
                .select(`
            *,
            meal_items (*)
          `)
                .eq('user_id', user.id)
                .order('logged_at', { ascending: false });

            if (error) throw error;

            setAllMeals(data || []);
            setDisplayedMeals(data?.slice(0, MEALS_PER_PAGE) || []);
            setHasMore(data && data.length > MEALS_PER_PAGE);

        } catch (error) {
            console.error('Error loading meals:', error);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadAllMeals();
        setTimeout(() => setRefreshing(false), 1000);
    };

    // Load more meals on scroll
    const loadMore = () => {
        if (loading || !hasMore) return;

        setLoading(true);

        const nextPage = page + 1;
        const startIndex = (nextPage - 1) * MEALS_PER_PAGE;
        const endIndex = startIndex + MEALS_PER_PAGE;

        const newMeals = allMeals.slice(0, endIndex);

        setDisplayedMeals(newMeals);
        setPage(nextPage);
        setHasMore(endIndex < allMeals.length);
        setLoading(false);
    };

    // Infinite scroll detection
    const observerTarget = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [loading, hasMore, page]);

    // Group meals by date
    const groupedMeals = displayedMeals.reduce((groups, meal) => {
        const date = new Date(meal.logged_at).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        if (!groups[date]) {
            groups[date] = [];
        }

        groups[date].push(meal);

        return groups;
    }, {} as Record<string, any[]>);

    const handleDelete = async (itemId: string) => {
        try {
            await deleteMealItem(itemId);
            toast({ description: "Item deleted", duration: 3000 });
            loadAllMeals(); // Reload to refresh list and totals
        } catch (error) {
            toast({ variant: "destructive", description: "Failed to delete item", duration: 5000 });
        }
    }

    return (
        <motion.div
            className="min-h-screen bg-background pb-20"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={() => (document.activeElement as HTMLElement)?.blur()}
        >
            {/* Top Section */}
            <div className="bg-white pb-4 pt-6 shadow-sm sticky top-0 z-10">
                <div className="px-5 flex justify-between items-center">
                    <h1 className="font-display text-2xl font-bold text-foreground">My History</h1>
                    <button
                        onClick={handleRefresh}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-secondary/80 active:scale-95"
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </div>

            <div className="space-y-6 pt-6 pb-24">
                {Object.entries(groupedMeals).map(([date, meals]) => (
                    <div key={date}>
                        <h3 className="text-sm font-semibold text-gray-600 px-6 mb-3">
                            {date}
                        </h3>

                        <div className="space-y-3 px-6">
                            {meals.map((meal) => {
                                const mealTypeDisplay = getMealTypeDisplay(meal.meal_type)

                                return (
                                    <div
                                        key={meal.id}
                                        onClick={() => navigate(`/diary/meal/${meal.id}`)}
                                        className="bg-white p-4 rounded-xl shadow-sm 
                                hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-3"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="text-2xl">{mealTypeDisplay.icon}</div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{meal.meal_name || 'Meal'}</h4>
                                                    <p className="text-xs text-muted-foreground">{mealTypeDisplay.label} • {new Date(meal.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-bold text-primary-foreground bg-primary px-3 py-1 rounded-xl block mb-1">
                                                    {meal.total_calories} <span className="text-[10px] font-normal">kcal</span>
                                                </span>
                                            </div>
                                        </div>

                                        {meal.meal_items && meal.meal_items.length > 0 && (
                                            <div className="mt-2 pl-2 border-l-2 border-muted space-y-1">
                                                {meal.meal_items.map((item: any) => (
                                                    <div key={item.id} className="flex justify-between text-xs text-muted-foreground">
                                                        <span>{item.quantity_g}g {item.custom_name}</span>
                                                        <span>{item.calories} kcal</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}

                {/* Loading indicator */}
                {hasMore && (
                    <div ref={observerTarget} className="py-8 flex justify-center">
                        {(loading || allMeals.length === 0) && (
                            <div className="w-8 h-8 border-4 border-[#F5C518] 
                                  border-t-transparent rounded-full animate-spin" />
                        )}
                    </div>
                )}

                {/* End of history */}
                {!hasMore && displayedMeals.length > 0 && (
                    <p className="text-center text-gray-500 py-8 text-sm">
                        📜 You've reached the beginning of your journey
                    </p>
                )}
            </div>

            <BottomNav />
            {/* FAB */}
            <FAB onClick={() => navigate("/capture")} />
        </motion.div>
    );
};

export default DiaryScreen;
