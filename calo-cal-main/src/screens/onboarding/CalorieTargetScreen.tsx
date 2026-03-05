import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { updateUserProfile } from "@/services/profileService";
import { useAuth } from "@/context/AuthContext";

const CalorieTargetScreen = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { refreshProfile } = useAuth();
    const [dailyGoal, setDailyGoal] = useState(2000);
    const [initialGoal, setInitialGoal] = useState(2000); // For animation base
    const [isAnimating, setIsAnimating] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [macros, setMacros] = useState({ p: 30, c: 45, f: 25 });

    useEffect(() => {
        calculateGoal();
    }, []);

    const calculateGoal = () => {
        const goalType = localStorage.getItem("onboarding_goal");
        const profileStr = localStorage.getItem("onboarding_profile");

        if (!goalType || !profileStr) {
            navigate("/onboarding/welcome");
            return;
        }

        const profile = JSON.parse(profileStr);
        const weight = parseFloat(profile.currentWeightKg);
        const height = parseFloat(profile.heightCm);
        const age = parseInt(profile.age);
        const sex = profile.sex;

        // Mifflin-St Jeor Equation
        let bmr = 10 * weight + 6.25 * height - 5 * age;
        bmr += sex === "male" ? 5 : -161;

        // TDEE (Moderate activity)
        const tdee = bmr * 1.55;

        // Goal Adjustment
        let target = tdee;
        if (goalType === "lose") target -= 500;
        if (goalType === "gain") target += 300;

        // Round to nearest 10
        const finalGoal = Math.round(target / 10) * 10;

        setDailyGoal(finalGoal);
        setInitialGoal(0);

        // Set macros based on goal
        if (goalType === "lose") setMacros({ p: 35, c: 40, f: 25 });
        else if (goalType === "maintain") setMacros({ p: 30, c: 45, f: 25 });
        else if (goalType === "gain") setMacros({ p: 35, c: 45, f: 20 });

        // Start count up animation
        setTimeout(() => setIsAnimating(false), 1200);
    };

    const adjustGoal = (amount: number) => {
        setDailyGoal((prev) => Math.max(1200, prev + amount));
    };

    const completeOnboarding = async () => {
        setIsSaving(true);
        try {
            const profileStr = localStorage.getItem("onboarding_profile");
            const goalType = localStorage.getItem("onboarding_goal");

            if (!profileStr) throw new Error("Missing profile data");
            const profile = JSON.parse(profileStr);

            await updateUserProfile({
                age: parseInt(profile.age),
                sex: profile.sex,
                height_cm: Math.round(parseFloat(profile.heightCm)),
                current_weight_kg: parseFloat(profile.currentWeightKg),
                target_weight_kg: parseFloat(profile.targetWeightKg),
                daily_calorie_goal: dailyGoal,
                goal_type: goalType ?? 'maintain',
                onboarding_completed: true
            });

            // Refresh profile in context so ProtectedRoute knows we're done
            await refreshProfile();

            // Cleanup
            localStorage.removeItem("onboarding_goal");
            localStorage.removeItem("onboarding_profile");

            navigate("/");
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error saving profile",
                description: "Could not save your plan. Please try again.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Macro calc
    const pGrams = Math.round((dailyGoal * (macros.p / 100)) / 4);
    const cGrams = Math.round((dailyGoal * (macros.c / 100)) / 4);
    const fGrams = Math.round((dailyGoal * (macros.f / 100)) / 9);

    return (
        <div className="min-h-screen bg-background pb-28">
            {/* Top Bar */}
            <header className="flex items-center gap-4 px-5 pt-6 pb-2">
                <button onClick={() => navigate(-1)} className="text-foreground">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <div className="flex flex-1 gap-1">
                    <div className="h-1.5 flex-1 rounded-full bg-[#F5C518]" />
                    <div className="h-1.5 flex-1 rounded-full bg-[#F5C518]" />
                    <div className="h-1.5 flex-1 rounded-full bg-[#F5C518]" />
                </div>
                <div className="w-6" />
            </header>

            <div className="px-5 pt-6 text-center">
                <h1 className="mb-2 font-display text-[28px] font-bold text-foreground">Your daily goal</h1>
                <p className="mb-8 font-body text-sm text-muted-foreground">Based on your profile</p>

                {/* Hero Number */}
                <div className="mb-8 flex flex-col items-center justify-center">
                    <div className="flex items-baseline gap-2">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-display text-[64px] font-bold text-[#F5C518]"
                        >
                            <CountUp end={dailyGoal} duration={1.2} />
                        </motion.span>
                        <span className="font-body text-lg text-muted-foreground">kcal/day</span>
                    </div>
                </div>

                {/* Macro Chart */}
                <div className="mb-8 flex justify-center">
                    <div className="relative h-48 w-48">
                        <svg viewBox="0 0 100 100" className="-rotate-90">
                            {/* Simple donut chart segments based on macros */}
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="20" />
                            <circle
                                cx="50" cy="50" r="40" fill="none" stroke="#3B82F6" strokeWidth="20"
                                strokeDasharray={`${macros.p * 2.51} 251`}
                                className="transition-all duration-1000"
                            />
                            <circle
                                cx="50" cy="50" r="40" fill="none" stroke="#F5C518" strokeWidth="20"
                                strokeDasharray={`${macros.c * 2.51} 251`}
                                strokeDashoffset={-(macros.p * 2.51)}
                                className="transition-all duration-1000"
                            />
                            <circle
                                cx="50" cy="50" r="40" fill="none" stroke="#22C55E" strokeWidth="20"
                                strokeDasharray={`${macros.f * 2.51} 251`}
                                strokeDashoffset={-((macros.p + macros.c) * 2.51)}
                                className="transition-all duration-1000"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-sm font-bold text-muted-foreground">Macros</span>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="mb-8 flex justify-center gap-4">
                    <div className="flex flex-col items-center gap-1 rounded-2xl bg-blue-50 px-4 py-2">
                        <span className="text-xs font-bold text-blue-600">{macros.p}% P</span>
                        <span className="text-sm font-bold text-foreground">{pGrams}g</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 rounded-2xl bg-yellow-50 px-4 py-2">
                        <span className="text-xs font-bold text-yellow-600">{macros.c}% C</span>
                        <span className="text-sm font-bold text-foreground">{cGrams}g</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 rounded-2xl bg-green-50 px-4 py-2">
                        <span className="text-xs font-bold text-green-600">{macros.f}% F</span>
                        <span className="text-sm font-bold text-foreground">{fGrams}g</span>
                    </div>
                </div>

                {/* Manual Adjust */}
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => adjustGoal(-50)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-secondary/80"
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-medium text-muted-foreground">Adjust manually</span>
                    <button
                        onClick={() => adjustGoal(50)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-secondary/80"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="fixed bottom-8 left-0 right-0 px-5">
                <button
                    onClick={completeOnboarding}
                    disabled={isSaving}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#F5C518] py-4 font-display font-bold text-foreground transition-opacity disabled:opacity-70"
                >
                    {isSaving && <Loader2 className="h-5 w-5 animate-spin" />}
                    Start tracking! 🚀
                </button>
            </div>
        </div>
    );
};

// Simple CountUp component
const CountUp = ({ end, duration }: { end: number, duration: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const increment = end / (duration * 60);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.round(start));
            }
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [end, duration]);

    return <>{count}</>;
};

export default CalorieTargetScreen;
