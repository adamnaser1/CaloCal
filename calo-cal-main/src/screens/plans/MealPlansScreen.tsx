import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Loader2, Star, Users, Flame, Shield, Leaf, Calendar } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import EmptyState from "@/components/EmptyState";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { motion } from "framer-motion";
import { getAllMealPlans, searchMealPlans, MealPlan } from "@/services/mealPlansService";
import { formatCalories } from "@/lib/utils";

const MealPlansScreen = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState<MealPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    useEffect(() => {
        const fetchPlans = async () => {
            setLoading(true);
            try {
                let data;
                if (searchQuery.length > 0) {
                    data = await searchMealPlans(searchQuery);
                    // Client-side filter for searched items if needed, or rely on API
                    // For now, search overrides category filter
                } else {
                    // Map UI filter to API category/goal
                    let filterArg = activeFilter;
                    if (activeFilter === 'Perte de poids') filterArg = 'lose'; // goal
                    if (activeFilter === 'Prise de masse') filterArg = 'gain'; // goal
                    if (activeFilter === 'Végétarien') filterArg = 'vegetarian'; // category
                    if (activeFilter === 'Ramadan') filterArg = 'ramadan'; // category
                    if (activeFilter === 'Tous') filterArg = 'all';

                    // Ideally service handles this mapping, but for now we pass 'all' or specific
                    // The service `getAllMealPlans` uses `category` param.
                    // If we want to filter by goal_type, we need to update service or do it client side.
                    // Given the service implementation: `if (category && category !== 'all') query.eq('category', category)`
                    // It only filters by category.
                    // Let's do client side filtering or update service.
                    // I'll stick to client side filtering provided by service or just fetching all and filtering here?
                    // Fetching all is safer for small datasets.
                    // But let's try to fetch all and filter in memory since dataset is small (5 plans).
                    data = await getAllMealPlans('all');

                    if (activeFilter !== 'Tous') {
                        data = data.filter(p => {
                            if (activeFilter === 'Perte de poids') return p.goal_type === 'lose';
                            if (activeFilter === 'Prise de masse') return p.goal_type === 'gain';
                            if (activeFilter === 'Végétarien') return p.category === 'vegetarian';
                            if (activeFilter === 'Ramadan') return p.category === 'ramadan';
                            return true;
                        });
                    }
                }
                setPlans(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchPlans();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, activeFilter]);

    const featuredPlan = plans.length > 0 ? plans[0] : null;
    const otherPlans = plans.length > 0 ? plans.slice(1) : [];

    const formatCount = (count: number) => {
        return count >= 1000 ? `${(count / 1000).toFixed(1)}K users` : `${count} users`;
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'bg-[#E6F4EA] text-[#1D6E3A]';
            case 'medium': return 'bg-[#FFF9E0] text-[#8A6D00]';
            case 'hard': return 'bg-[#FDECEA] text-[#B71C1C]';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-background pb-28">
            <header className="px-5 pt-8 pb-4">
                <h1 className="font-display text-2xl font-bold text-foreground">Meal Plans</h1>
                <p className="text-sm text-muted-foreground">Tailored nutrition for your goals</p>
            </header>

            {/* Search */}
            <div className="px-5 mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search for a plan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-2xl bg-secondary py-4 pl-12 pr-4 font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto px-5">
                {['Tous', 'Perte de poids', 'Prise de masse', 'Végétarien', 'Ramadan'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${activeFilter === filter
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="px-5 space-y-4">
                    <SkeletonLoader variant="card" className="h-64 rounded-[32px]" />
                    <div className="grid grid-cols-2 gap-4">
                        <SkeletonLoader variant="card" count={4} className="h-48 rounded-[24px]" />
                    </div>
                </div>
            ) : (
                <div className="px-5 pb-8">
                    {/* Featured Plan */}
                    {featuredPlan && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <h2 className="mb-4 font-display text-lg font-bold text-foreground">Featured Plan</h2>
                            <Link to={`/plans/${featuredPlan.id}`}>
                                <div className="relative overflow-hidden rounded-[32px] bg-card shadow-sm transition-transform active:scale-[0.98]">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    {/* Placeholder image logic or fallback gradient/color */}
                                    <div className="h-64 w-full bg-gray-300 object-cover" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }} />

                                    <div className="absolute top-4 right-4 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                                        Active users: {formatCount(featuredPlan.users_count)}
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <div className={`mb-2 inline-block rounded-lg px-2 py-1 text-xs font-bold uppercase tracking-wider ${getDifficultyColor(featuredPlan.difficulty)}`}>
                                            {featuredPlan.difficulty}
                                        </div>
                                        <h3 className="mb-2 font-display text-2xl font-bold leading-tight text-white">
                                            {featuredPlan.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm font-medium text-white/90">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {featuredPlan.duration_days} days
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Flame className="h-4 w-4" />
                                                {formatCalories(featuredPlan.avg_calories_per_day)} kcal
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    )}

                    {/* Other Plans Grid */}
                    {otherPlans.length > 0 && (
                        <div>
                            <h2 className="mb-4 font-display text-lg font-bold text-foreground">More Plans</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {otherPlans.map((plan, index) => (
                                    <motion.div
                                        key={plan.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link to={`/plans/${plan.id}`}>
                                            <div className="flex h-full flex-col rounded-[24px] bg-card p-4 shadow-sm transition-transform active:scale-[0.98]">
                                                <div className="mb-3 flex items-start justify-between">
                                                    <div className={`rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${getDifficultyColor(plan.difficulty)}`}>
                                                        {plan.difficulty}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs font-bold text-orange-500">
                                                        <Star className="h-3 w-3 fill-current" />
                                                        {plan.rating}
                                                    </div>
                                                </div>

                                                <h3 className="mb-1 line-clamp-2 font-display text-lg font-bold leading-tight text-foreground">
                                                    {plan.title}
                                                </h3>

                                                <div className="mt-auto pt-3 text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-3 w-3" />
                                                        {formatCount(plan.users_count)}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {plans.length === 0 && (
                        <EmptyState
                            emoji="🍽️"
                            title="No plans found"
                            subtitle="Try a different search or browse all plans"
                            primaryAction={{
                                label: "Browse all plans",
                                onClick: () => {
                                    setSearchQuery('');
                                    setActiveFilter('Tous');
                                }
                            }}
                        />
                    )}
                </div>
            )}

            <BottomNav />
        </div>
    );
};

export default MealPlansScreen;
