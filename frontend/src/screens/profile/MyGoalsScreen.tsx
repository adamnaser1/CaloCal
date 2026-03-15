import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Target, ChevronRight, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // Assuming we have getUserProfile etc, or create separate service usage
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { updateUserProfile } from "@/services/profileService";
import { useLanguage } from "@/contexts/LanguageContext";



export default function MyGoalsScreen() {
    const navigate = useNavigate();
    const { user, refreshProfile } = useAuth();
    const { toast } = useToast();
    const { t } = useLanguage();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [goalType, setGoalType] = useState<"lose_weight" | "maintain" | "build_muscle">("maintain");
    const [activityLevel, setActivityLevel] = useState<string>("sedentary");

    useEffect(() => {
        if (!user) return;
        async function loadProfile() {
            const { data } = await supabase.from('profiles').select('*').eq('id', user!.id).single();
            if (data) {
                setProfile(data);
                setGoalType(data.goal_type || "maintain");
                setActivityLevel(data.activity_level || "sedentary");
            }
            setLoading(false);
        }
        loadProfile();
    }, [user]);

    const calculateCalories = () => {
        // Mifflin-St Jeor
        if (!profile) return 2000;
        const weight = profile.current_weight_kg || 70;
        const height = profile.height_cm || 170;
        const age = profile.age || 30;
        const isMale = profile.sex === 'male';

        let bmr = 10 * weight + 6.25 * height - 5 * age + (isMale ? 5 : -161);

        const multipliers: Record<string, number> = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            very_active: 1.9
        };

        const activity = multipliers[activityLevel] || 1.2;
        let tdee = bmr * activity;

        if (goalType === 'lose_weight') return Math.round(tdee - 500);
        if (goalType === 'build_muscle') return Math.round(tdee + 300);
        return Math.round(tdee);
    };

    const handleSave = async () => {
        setSaving(true);
        const newTarget = calculateCalories();

        try {
            await updateUserProfile({
                goal_type: goalType,
                activity_level: activityLevel,
                daily_calorie_goal: newTarget
            });

            await refreshProfile();

            toast({ title: t('profile.preferenceSaved'), description: `${t('myGoals.dailyTarget')}: ${newTarget} kcal` });

            setProfile({ ...profile, daily_calorie_goal: newTarget });
        } catch (error: any) {
            toast({ variant: "destructive", title: t('common.error'), description: error.message });
        } finally {

            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background p-6">
                <SkeletonLoader className="h-10 w-full mb-8" variant="text" />
                <SkeletonLoader className="h-64 w-full rounded-xl" variant="card" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-32">
            <header className="flex items-center gap-4 px-5 pt-6 pb-6">
                <button onClick={() => navigate(-1)} className="rounded-full bg-secondary p-2">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="font-display text-xl font-bold">{t('myGoals.title')}</h1>

            </header>

            <div className="px-5 space-y-6">
                {/* Current Goal Card */}
                <div className="rounded-3xl bg-primary/10 p-6 flex items-start gap-4">
                    <div className="rounded-xl bg-[#F5C518] p-3 text-foreground">
                        <Target className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg capitalize">{t(`onboarding.${goalType}`)}</h2>

                        <p className="text-sm text-muted-foreground mt-1">
                            {t('myGoals.dailyTarget')}: <span className="font-bold text-foreground">{profile?.daily_calorie_goal} kcal</span>

                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-lg">{t('myGoals.updateGoal')}</h3>


                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { id: 'lose_weight', label: t('onboarding.loseWeight'), icon: '📉' },
                            { id: 'maintain', label: t('onboarding.maintainWeight'), icon: '⚖️' },
                            { id: 'build_muscle', label: t('onboarding.buildMuscle'), icon: '💪' }

                        ].map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setGoalType(option.id as any)}
                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${goalType === option.id
                                    ? 'border-[#F5C518] bg-[#F5C518]/5'
                                    : 'border-transparent bg-secondary'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{option.icon}</span>
                                    <span className="font-bold">{option.label}</span>
                                </div>
                                {goalType === option.id && <Check className="h-5 w-5 text-[#F5C518]" />}
                            </button>
                        ))}
                    </div>

                    <h3 className="font-bold text-lg pt-4">{t('myGoals.activityLevel')}</h3>

                    <div className="space-y-2">
                        {[
                            { id: 'sedentary', label: t('myGoals.sedentary') },
                            { id: 'light', label: t('myGoals.light') },
                            { id: 'moderate', label: t('myGoals.moderate') },
                            { id: 'active', label: t('myGoals.active') }

                        ].map((level) => (
                            <button
                                key={level.id}
                                onClick={() => setActivityLevel(level.id)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl text-sm font-bold transition-colors ${activityLevel === level.id
                                    ? 'bg-foreground text-background'
                                    : 'bg-secondary text-muted-foreground'
                                    }`}
                            >
                                {level.label}
                                {activityLevel === level.id && <Check className="h-4 w-4" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-8 left-0 right-0 px-5">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full rounded-full bg-[#F5C518] py-4 font-display font-bold text-foreground shadow-lg disabled:opacity-50"
                >
                    {saving ? t('myGoals.updating') : t('myGoals.updateGoal')}

                </button>
            </div>
        </div>
    );
}
