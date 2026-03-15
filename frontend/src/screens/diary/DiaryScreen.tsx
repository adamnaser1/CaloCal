import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RefreshCw, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCalories } from "@/lib/utils";
import FAB from "@/components/FAB";
import { deleteMealItem } from "@/services/diaryService";
import DiaryFilters from "./components/DiaryFilters";
import { isSameDay } from "date-fns";

import { safeToLower, getEmoji, getMealTypeDisplay } from "@/lib/ui-utils";

const DiaryScreen = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { t, language } = useLanguage();

    const [allMeals, setAllMeals] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [filterMode, setFilterMode] = useState<'all' | 'high-calorie'>('all');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [calorieThreshold] = useState(2000); // Could be fetched from profile

    const MEALS_PER_PAGE = 20;

    // Filter all meals
    const filteredMeals = useMemo(() => {
        let result = allMeals;

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(meal =>
                meal.meal_name?.toLowerCase().includes(query) ||
                meal.meal_items?.some((item: any) => item.name?.toLowerCase().includes(query))
            );
        }

        // Date filter
        if (selectedDate) {
            result = result.filter(meal => isSameDay(new Date(meal.logged_at), selectedDate));
        }

        return result;
    }, [allMeals, searchQuery, selectedDate]);

    // Group and apply day-level filters (like high-calorie)
    const { finalGroupedMeals, hasMoreResults } = useMemo(() => {
        const isFiltering = searchQuery || selectedDate || filterMode !== 'all';

        // Group them
        const groups = filteredMeals.reduce((acc, meal) => {
            const d = new Date(meal.logged_at);
            const dateKey = d.toISOString().split('T')[0];
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(meal);
            return acc;
        }, {} as Record<string, any[]>);

        // Second pass: Filter groups by high calorie threshold if needed
        let entries = Object.entries(groups);
        if (filterMode === 'high-calorie') {
            entries = entries.filter(([_, meals]) => {
                const mealList = meals as any[];
                const total = mealList.reduce((sum, m) => sum + (m.total_calories || 0), 0);
                return total >= calorieThreshold;
            });
        }

        // Pagination: only limit if not filtering
        const totalEntries = entries.length;
        if (!isFiltering) {
            entries = entries.slice(0, page * 5); // Limit to 5 days initially
        }

        return {
            finalGroupedMeals: Object.fromEntries(entries),
            hasMoreResults: !isFiltering && (page * 5 < totalEntries)
        };
    }, [filteredMeals, filterMode, calorieThreshold, page, searchQuery, selectedDate]);

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
            setPage(1);
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
        if (loading || !hasMoreResults) return;
        setPage(prev => prev + 1);
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
    }, [loading, hasMoreResults, page]);

    const formatDateHeader = (dateStr: string) => {
        const d = new Date(dateStr);
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        if (dateStr === today) return language === 'ar' ? 'اليوم' : (language === 'fr' ? "Aujourd'hui" : 'Today');
        if (dateStr === yesterday) return language === 'ar' ? 'البارح' : (language === 'fr' ? 'Hier' : 'Yesterday');

        return d.toLocaleDateString(language === 'ar' ? 'ar-TN' : (language === 'fr' ? 'fr-FR' : 'en-US'), {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    };

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
            <div className={`pt-6 pb-4 sticky top-0 z-20 transition-colors duration-200 border-b border-white/10
                ${language === 'ar' ? 'font-arabic' : ''}`}
                style={{ backgroundColor: 'var(--background)', backdropFilter: 'blur(8px)' }}
            >
                <div className="px-5 flex justify-between items-center">
                    <h1 className="font-display text-2xl font-bold text-foreground">
                        {t('diary')}
                    </h1>
                    <button
                        onClick={handleRefresh}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-all hover:bg-secondary/80 active:scale-95 shadow-sm"
                    >
                        <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </div>

            <DiaryFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterMode={filterMode}
                setFilterMode={setFilterMode}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                calorieThreshold={calorieThreshold}
            />

            <div className="pt-4 pb-24">
                {Object.entries(finalGroupedMeals).length === 0 && !loading ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4 text-3xl">
                            📖
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-2">{t('diary.emptyTitle') || 'Your diary is empty'}</h2>
                        <p className="text-muted-foreground">{t('diary.emptySubtitle') || 'Start logging your meals to see them here!'}</p>
                    </div>
                ) : (
                    Object.entries(finalGroupedMeals).map(([dateKey, meals]: [string, any[]]) => {
                        // Calculate daily totals
                        const dayCalories = meals.reduce((sum, m) => sum + (m.total_calories || 0), 0);
                        const dayPro = meals.reduce((sum, m) => sum + (m.total_proteins || 0), 0);
                        const dayCarbs = meals.reduce((sum, m) => sum + (m.total_carbs || 0), 0);
                        const dayFats = meals.reduce((sum, m) => sum + (m.total_fats || 0), 0);

                        return (
                            <div key={dateKey} className="mb-8">
                                <div className="px-5 mb-4 sticky top-[73px] z-10 py-2 bg-background/95 backdrop-blur-sm">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                            {formatDateHeader(dateKey)}
                                        </h3>
                                        <div className="text-right">
                                            <span className="text-lg font-black text-foreground">{dayCalories}</span>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase ml-1">kcal</span>
                                        </div>
                                    </div>

                                    {/* Daily Macro Summary Bar */}
                                    <div className="mt-2 grid grid-cols-3 gap-2">
                                        <div className="bg-secondary/50 rounded-lg py-1.5 px-3 flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-blue-500 uppercase">Pro</span>
                                            <span className="text-xs font-bold text-foreground">{Math.round(dayPro)}g</span>
                                        </div>
                                        <div className="bg-secondary/50 rounded-lg py-1.5 px-3 flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-yellow-600 uppercase">Carb</span>
                                            <span className="text-xs font-bold text-foreground">{Math.round(dayCarbs)}g</span>
                                        </div>
                                        <div className="bg-secondary/50 rounded-lg py-1.5 px-3 flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-green-600 uppercase">Fat</span>
                                            <span className="text-xs font-bold text-foreground">{Math.round(dayFats)}g</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 px-5">
                                    {meals.map((meal) => {
                                        const mealTypeDisplay = getMealTypeDisplay(meal.meal_type)

                                        return (
                                            <motion.div
                                                key={meal.id}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => navigate(`/diary/meal/${meal.id}`)}
                                                className="bg-card border border-white/10 p-4 rounded-2xl shadow-sm 
                                                    hover:shadow-md transition-all cursor-pointer group"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-xl shadow-inner">
                                                            {mealTypeDisplay.icon}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                                                                {meal.meal_name || t('meal')}
                                                            </h4>
                                                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                                <span className="bg-secondary/80 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">
                                                                    {t(`mealType.${meal.meal_type}`) || mealTypeDisplay.label}
                                                                </span>
                                                                <span className="opacity-40">•</span>
                                                                {new Date(meal.logged_at).toLocaleTimeString(language === 'ar' ? 'ar-TN' : 'en-US', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="text-lg font-black text-foreground">
                                                            {meal.total_calories}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">kcal</p>
                                                    </div>
                                                </div>

                                                {/* Meal Items Preview */}
                                                {meal.meal_items && meal.meal_items.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                                        {meal.meal_items.slice(0, 3).map((item: any, idx: number) => (
                                                            <span key={item.id} className="text-[10px] bg-secondary/30 px-2 py-1 rounded-full text-muted-foreground">
                                                                {getEmoji(item.name)} {item.name}
                                                            </span>
                                                        ))}
                                                        {meal.meal_items.length > 3 && (
                                                            <span className="text-[10px] text-muted-foreground pt-1">
                                                                +{meal.meal_items.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Macros breakdown */}
                                                <div className="flex items-center gap-4 pt-3 border-t border-white/5">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80 shadow-[0_0_4px_rgba(59,130,246,0.5)]" />
                                                        <span className="text-[11px] font-bold text-muted-foreground">
                                                            {Math.round(meal.total_proteins)}g
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/80 shadow-[0_0_4px_rgba(234,179,8,0.5)]" />
                                                        <span className="text-[11px] font-bold text-muted-foreground">
                                                            {Math.round(meal.total_carbs)}g
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500/80 shadow-[0_0_4px_rgba(34,197,94,0.5)]" />
                                                        <span className="text-[11px] font-bold text-muted-foreground">
                                                            {Math.round(meal.total_fats)}g
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </div>
                        );
                    })
                )}

                {/* Loading indicator */}
                {hasMoreResults && (
                    <div ref={observerTarget} className="py-8 flex justify-center">
                        {(loading || allMeals.length === 0) && (
                            <div className="w-8 h-8 border-4 border-[#F5C518] 
                                  border-t-transparent rounded-full animate-spin" />
                        )}
                    </div>
                )}

                {/* End of history */}
                {!hasMoreResults && allMeals.length > 0 && (
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
