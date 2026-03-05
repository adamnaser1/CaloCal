import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Star, Users, Flame, Calendar, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Assuming framer-motion is available based on other files
import { getMealPlanById, MealPlan, MealPlanDay } from "@/services/mealPlansService";
import { useToast } from "@/hooks/use-toast";

const MealPlanDetailScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [plan, setPlan] = useState<MealPlan | null>(null);
    const [days, setDays] = useState<MealPlanDay[]>([]);
    const [activeDay, setActiveDay] = useState(1);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const result = await getMealPlanById(id);
                if (result) {
                    setPlan(result.plan);
                    setDays(result.days);
                } else {
                    toast({ variant: "destructive", title: "Plan not found", description: "This plan does not exist or has been removed." });
                    navigate('/plans');
                }
            } catch (error) {
                console.error(error);
                toast({ variant: "destructive", title: "Error", description: "Failed to load meal plan details." });
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, navigate, toast]);

    const handleStartPlan = async () => {
        if (!plan) return;
        setStarting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast({
            title: "Plan started! 🎉",
            description: `${plan.title} is now your active meal plan.`
        });

        setStarting(false);
        navigate('/');
    };

    const formatCount = (count: number) => {
        return count >= 1000 ? `${(count / 1000).toFixed(1)}K users` : `${count} users`;
    };

    const activeMeals = days.filter(d => d.day_number === activeDay);

    // Sort meals: breakfast, lunch, snack, dinner (or desired order)
    const mealOrder = { 'breakfast': 1, 'lunch': 2, 'snack': 3, 'dinner': 4 };
    activeMeals.sort((a, b) => (mealOrder[a.meal_type] || 99) - (mealOrder[b.meal_type] || 99));

    const getMealEmoji = (type: string) => {
        switch (type) {
            case 'breakfast': return '🌅';
            case 'lunch': return '☀️';
            case 'dinner': return '🌙';
            case 'snack': return '🍎';
            default: return '🍽️';
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!plan) return null;

    return (
        <div className="min-h-screen bg-background pb-28">
            {/* Header Image Area */}
            <div className="relative h-72 w-full">
                <div className="absolute inset-0 bg-gray-300" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2070&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background" />

                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 z-10 rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition-colors hover:bg-black/40"
                >
                    <ArrowLeft className="h-6 w-6" />
                </button>
            </div>

            {/* Content Overlap */}
            <div className="relative -mt-12 px-5">
                <div className="mb-6">
                    <h1 className="mb-2 font-display text-3xl font-bold leading-tight text-foreground">
                        {plan.title}
                    </h1>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        {plan.description}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="flex flex-col items-center justify-center rounded-2xl bg-secondary p-3 text-center">
                        <Calendar className="mb-1 h-5 w-5 text-primary" />
                        <span className="text-xs font-bold text-foreground">{plan.duration_days} days</span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-2xl bg-secondary p-3 text-center">
                        <Flame className="mb-1 h-5 w-5 text-orange-500" />
                        <span className="text-xs font-bold text-foreground">{plan.avg_calories_per_day} kcal</span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-2xl bg-secondary p-3 text-center">
                        <Star className="mb-1 h-5 w-5 text-yellow-500 fill-current" />
                        <span className="text-xs font-bold text-foreground">{plan.rating}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-2xl bg-secondary p-3 text-center">
                        <Users className="mb-1 h-5 w-5 text-blue-500" />
                        <span className="text-xs font-bold text-foreground">{formatCount(plan.users_count)}</span>
                    </div>
                </div>

                {/* Day Selector */}
                <div className="mb-6">
                    <h2 className="mb-3 font-display text-lg font-bold text-foreground">Menu</h2>
                    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
                        {/* Create array of days up to duration, effectively checking if we have data for them */}
                        {/* Assuming we might not have data for all days in the database yet, we only show days present in 'days' array? 
                           Or show 1..duration and empty state if missing? 
                           Prompt says: "Only show day pills that have data in days array"
                       */}
                        {Array.from(new Set(days.map(d => d.day_number))).sort((a, b) => a - b).map((dayNum) => (
                            <button
                                key={dayNum}
                                onClick={() => setActiveDay(dayNum)}
                                className={`flex h-12 min-w-[3rem] items-center justify-center rounded-xl text-sm font-bold transition-all ${activeDay === dayNum
                                        ? 'bg-[#F5C518] text-black shadow-md scale-105'
                                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                                    }`}
                            >
                                D{dayNum}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Meals List */}
                <div className="mb-24 space-y-3">
                    {activeMeals.length > 0 ? (
                        activeMeals.map((meal) => (
                            <div key={meal.id} className="flex items-center gap-4 rounded-3xl bg-card p-4 shadow-sm">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-2xl">
                                    {getMealEmoji(meal.meal_type)}
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        {meal.meal_type} • {meal.estimated_calories} kcal
                                    </div>
                                    <div className="font-display font-bold text-foreground">
                                        {meal.food_description}
                                    </div>
                                </div>
                                <div className="h-6 w-6 rounded-full border-2 border-dashed border-gray-300" />
                            </div>
                        ))
                    ) : (
                        <div className="rounded-3xl bg-secondary/50 p-8 text-center text-muted-foreground">
                            No meals found for this day.
                        </div>
                    )}
                </div>

                {/* Start Button */}
                <div className="fixed bottom-8 left-0 right-0 px-5">
                    <button
                        onClick={handleStartPlan}
                        disabled={starting}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-display font-bold text-primary-foreground shadow-fab transition-transform active:scale-[0.98] disabled:opacity-70"
                    >
                        {starting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Start this plan"}
                        {!starting && <CheckCircle2 className="h-5 w-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MealPlanDetailScreen;
