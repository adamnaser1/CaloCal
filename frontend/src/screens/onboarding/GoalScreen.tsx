import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const GoalScreen = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

    const goals = [
        {
            id: "lose",
            icon: "🔥",
            title: t('onboarding.loseWeight'),
            subtitle: t('onboarding.loseWeightDesc'),
        },
        {
            id: "maintain",
            icon: "⚖️",
            title: t('onboarding.maintainWeight'),
            subtitle: t('onboarding.maintainWeightDesc'),
        },
        {
            id: "gain",
            icon: "💪",
            title: t('onboarding.buildMuscle'),
            subtitle: t('onboarding.buildMuscleDesc'),
        },
    ];

    const handleContinue = () => {
        if (selectedGoal) {
            localStorage.setItem("onboarding_goal", selectedGoal);
            navigate("/onboarding/profile");
        }
    };

    return (
        <div className="min-h-screen bg-background pb-8">
            {/* Top Bar */}
            <header className="flex items-center gap-4 px-5 pt-6 pb-2">
                <button onClick={() => navigate(-1)} className="text-foreground">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <div className="flex flex-1 gap-1">
                    <div className="h-1.5 flex-1 rounded-full bg-[#F5C518]" />
                    <div className="h-1.5 flex-1 rounded-full bg-border" />
                    <div className="h-1.5 flex-1 rounded-full bg-border" />
                </div>
                <div className="w-6" /> {/* Spacer for balance */}
            </header>

            <div className="px-5 pt-6">
                <h1 className="mb-2 font-display text-[28px] font-bold text-foreground">{t('onboarding.goalTitle')}</h1>
                <p className="mb-8 font-body text-sm text-muted-foreground">{t('onboarding.goalSubtitle')}</p>

                <div className="flex flex-col gap-4">
                    {goals.map((goal) => (
                        <motion.button
                            key={goal.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedGoal(goal.id)}
                            className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${selectedGoal === goal.id
                                ? "border-[#F5C518] bg-[#FFF9E0] ring-1 ring-[#F5C518]"
                                : "border-border bg-white"
                                }`}
                        >
                            <span className="text-2xl">{goal.icon}</span>
                            <div>
                                <h3 className="font-display text-lg font-bold text-foreground">{goal.title}</h3>
                                <p className="font-body text-sm text-muted-foreground">{goal.subtitle}</p>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-8 left-0 right-0 px-5">
                <button
                    onClick={handleContinue}
                    disabled={!selectedGoal}
                    className="w-full rounded-full bg-[#F5C518] py-4 font-display font-bold text-foreground transition-opacity disabled:opacity-40"
                >
                    {t('onboarding.continue')}
                </button>
            </div>
        </div>
    );
};

export default GoalScreen;
