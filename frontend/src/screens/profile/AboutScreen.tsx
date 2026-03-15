import { motion } from "framer-motion";
import { ArrowLeft, Heart, Code, Sparkles, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutScreen = () => {
    const navigate = useNavigate();
    const { t, language } = useLanguage();

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen bg-background pb-10"
        >
            <header className="px-5 pt-8 pb-4 flex items-center gap-4 sticky top-0 bg-background/80 backdrop-blur-md z-10">
                <button
                    onClick={() => navigate("/profile")}
                    className="p-2 rounded-full bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-display font-bold text-foreground">{t('profile.about')}</h1>
            </header>

            <div className="px-5 pt-6 space-y-8">
                <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#F5C518] to-[#F97316] rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                        <span className="text-4xl">🥗</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-display font-black text-foreground tracking-tight">Calo Cal</h2>
                        <p className="text-sm font-bold text-primary uppercase tracking-widest">{t('v1.0.0') || "Version 1.2.0"}</p>
                    </div>
                </div>

                <div className="bg-card border border-white/5 p-6 rounded-3xl space-y-4 relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                    <div className="flex items-center gap-3 mb-2">
                        <Heart className="w-6 h-6 text-red-500 fill-red-500/20" />
                        <h3 className="font-bold text-lg text-foreground">{t('about.ourMission') || "Our Mission"}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                        {t('about.missionDesc') || "Calo Cal was built to simplify nutrition tracking in Tunisia. We combine advanced AI image recognition with a deep understanding of local food culture to help you reach your goals effortlessly."}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/30 p-5 rounded-2xl border border-white/5 hover:border-primary/20 transition-colors">
                        <Code className="w-6 h-6 text-blue-500 mb-3" />
                        <h4 className="font-bold text-foreground mb-1">{t('about.modernTech')}</h4>
                        <p className="text-xs text-muted-foreground">{t('about.modernTechDesc')}</p>
                    </div>
                    <div className="bg-secondary/30 p-5 rounded-2xl border border-white/5 hover:border-primary/20 transition-colors">
                        <Sparkles className="w-6 h-6 text-yellow-500 mb-3" />
                        <h4 className="font-bold text-foreground mb-1">{t('about.smartVision')}</h4>
                        <p className="text-xs text-muted-foreground">{t('about.smartVisionDesc')}</p>

                    </div>
                </div>

                <div className="pt-8 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <span>{t('about.madeWith', { emoji: '☕' }).split('{emoji}')[0]}</span>
                        <Coffee className="w-4 h-4 text-orange-500" />
                        <span>{t('about.madeWith', { emoji: '☕' }).split('{emoji}')[1]}</span>
                    </div>

                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-50">
                        &copy; 2024 Calo Cal Team
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default AboutScreen;
