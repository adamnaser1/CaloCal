import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { Plus, Flame, Target } from "lucide-react";
import { motion } from "framer-motion";
import EmptyState from "@/components/EmptyState";
import BottomNav from "@/components/BottomNav";
import WeightLogModal from "@/components/WeightLogModal";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { formatCalories } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import {
    getWeightLogs,
    getCalorieSummaryByDay,
    getStreak,
    WeightLog
} from "@/services/progressService";
import { getUserProfile, Profile } from "@/services/profileService";

const ProgressScreen = () => {
    const navigate = useNavigate();
    const { t, language } = useLanguage();
    const isAr = language === 'ar';

    const [view, setView] = useState<'week' | 'month' | '3M'>('week');
    const [loading, setLoading] = useState(true);
    const [showWeightModal, setShowWeightModal] = useState(false);

    // Data states
    const [weightData, setWeightData] = useState<{ day: string, weight: number }[]>([]);
    const [calorieData, setCalorieData] = useState<{ day: string, calories: number, goal: number }[]>([]);
    const [streak, setStreak] = useState(0);
    const [currentWeight, setCurrentWeight] = useState(0);
    const [targetWeight, setTargetWeight] = useState(0);
    const [avgCalories, setAvgCalories] = useState(0);

    const fetchData = async () => {
        setLoading(true);
        try {
            const days = view === 'week' ? 7 : view === 'month' ? 30 : 90;

            const [logs, calories, streakCount, profile] = await Promise.all([
                getWeightLogs(days),
                getCalorieSummaryByDay(days),
                getStreak(),
                getUserProfile()
            ]);

            // Process Weight Data
            const wData = logs.map(l => ({
                day: new Date(l.logged_at).toLocaleDateString(language, { day: 'numeric', month: 'short' }),
                weight: l.weight_kg
            }));
            setWeightData(wData);

            // Process Calorie Data
            const goal = profile?.daily_calorie_goal || 2000;
            const cData = calories.map(c => ({
                day: c.day,
                calories: c.calories,
                goal: goal
            }));
            setCalorieData(cData);

            // Stats
            if (cData.length > 0) {
                const total = cData.reduce((sum, d) => sum + d.calories, 0);
                setAvgCalories(Math.round(total / cData.length));
            } else {
                setAvgCalories(0);
            }

            setStreak(streakCount);
            setTargetWeight(profile?.target_weight_kg || 0);

            // Current weight logic: last log or profile
            if (logs.length > 0) {
                setCurrentWeight(logs[logs.length - 1].weight_kg);
            } else if (profile?.current_weight_kg) {
                setCurrentWeight(profile.current_weight_kg);
            }

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [view, language]);

    return (
        <motion.div
            className={`min-h-screen bg-background pb-28 ${isAr ? 'rtl' : 'ltr'}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ direction: isAr ? 'rtl' : 'ltr' }}
        >
            <header className="px-5 pt-8 pb-4">
                <h1 className="font-display text-2xl font-bold text-foreground">{t('progress.title')}</h1>
                <p className="text-sm text-muted-foreground">{t('progress.subtitle')}</p>
            </header>

            {/* Time toggles */}
            <div className="px-5 mb-6">
                <div className="flex bg-secondary rounded-xl p-1">
                    {(['week', 'month', '3M'] as const).map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${view === v ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
                                }`}
                        >
                            {v === '3M' ? t('progress.threeMonths') : v === 'week' ? t('progress.week') : t('progress.month')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 px-5 mb-8">
                {/* Streak */}
                <div className="rounded-3xl bg-orange-50 p-5">
                    <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 ${isAr ? 'mr-0 ml-auto' : ''}`}>
                        <Flame className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="font-display text-2xl font-bold text-foreground">{streak}</div>
                    <div className="text-xs font-medium text-muted-foreground">{t('progress.dayStreak')}</div>
                </div>

                {/* Avg Calories */}
                <div className="rounded-3xl bg-green-50 p-5">
                    <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 ${isAr ? 'mr-0 ml-auto' : ''}`}>
                        <Target className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="font-display text-2xl font-bold text-foreground">{formatCalories(avgCalories)}</div>
                    <div className="text-xs font-medium text-muted-foreground">{t('progress.avgCalories')}</div>
                </div>
            </div>

            {/* Weight Chart Section */}
            <section className="px-5 mb-8">
                <div className="mb-4 flex items-center justify-between">
                    <div className={isAr ? 'text-right' : 'text-left'}>
                        <h2 className="font-display text-lg font-bold text-foreground">{t('progress.weightLog')}</h2>
                        {targetWeight > 0 && (
                            <p className="text-xs text-muted-foreground">{t('progress.target')}: {targetWeight} kg</p>
                        )}
                    </div>
                    <button
                        onClick={() => setShowWeightModal(true)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5C518] text-[#1A1A1A] shadow-sm hover:scale-105 active:scale-95 transition-transform"
                    >
                        <Plus className="h-5 w-5" />
                    </button>
                </div>

                {loading ? (
                    <SkeletonLoader variant="chart" className="h-64 rounded-3xl" />
                ) : weightData.length > 0 ? (
                    <div className="h-64 w-full rounded-3xl bg-white p-4 shadow-sm">
                        <div className={`mb-4 flex items-baseline gap-2 ${isAr ? 'flex-row-reverse' : ''}`}>
                            <span className="font-display text-3xl font-bold">{currentWeight}</span>
                            <span className="text-sm font-medium text-muted-foreground">kg</span>
                        </div>
                        <div className="h-40 w-full" style={{ direction: 'ltr' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weightData}>
                                    <defs>
                                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#F5C518" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#F5C518" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ color: '#000', fontWeight: 'bold' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="weight"
                                        stroke="#F5C518"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorWeight)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <EmptyState
                        emoji="⚖️"
                        title={t('progress.noWeightData')}
                        subtitle={t('progress.noWeightSubtitle')}
                        primaryAction={{
                            label: t('progress.logWeight'),
                            onClick: () => setShowWeightModal(true)
                        }}
                    />
                )}
            </section>

            {/* Calorie Trend Section */}
            <section className="px-5 mb-8">
                <h2 className={`mb-4 font-display text-lg font-bold text-foreground ${isAr ? 'text-right' : ''}`}>{t('progress.calorieTrend')}</h2>
                {loading ? (
                    <SkeletonLoader variant="chart" className="h-64 rounded-3xl" />
                ) : calorieData.length > 0 ? (
                    <div className="h-64 w-full rounded-3xl bg-white p-4 shadow-sm">
                        <div className="h-full w-full" style={{ direction: 'ltr' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={calorieData}>
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#6b7280' }}
                                        dy={10}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="calories" radius={[6, 6, 0, 0]}>
                                        {calorieData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.calories <= entry.goal ? '#22C55E' : '#F97316'}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <EmptyState
                        emoji="📊"
                        title={t('progress.noMealsTrend')}
                        subtitle={t('progress.noMealsTrendSubtitle')}
                        primaryAction={{
                            label: t('capture.title'),
                            onClick: () => navigate("/capture")
                        }}
                    />
                )}
            </section>

            <WeightLogModal
                isOpen={showWeightModal}
                onClose={() => setShowWeightModal(false)}
                onSaved={fetchData}
                currentWeight={currentWeight}
            />

            <BottomNav />
        </motion.div>
    );
};

export default ProgressScreen;
