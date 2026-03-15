import { motion } from "framer-motion";
import { ArrowLeft, Shield, Lock, Eye, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const PrivacyScreen = () => {
    const navigate = useNavigate();
    const { t, language } = useLanguage();

    const sections = [
        {
            icon: <Shield className="w-5 h-5 text-blue-500" />,
            title: t('privacy.dataCollection') || "Data Collection",
            content: t('privacy.dataCollectionDesc') || "We only collect data necessary for tracking your nutrition goals, including age, weight, height, and meal logs."
        },
        {
            icon: <Lock className="w-5 h-5 text-green-500" />,
            title: t('privacy.security') || "Security",
            content: t('privacy.securityDesc') || "Your data is securely stored in Supabase and is only accessible by you. We use industry-standard encryption for all data transfers."
        },
        {
            icon: <Eye className="w-5 h-5 text-purple-500" />,
            title: t('privacy.sharing') || "Data Sharing",
            content: t('privacy.sharingDesc') || "We never sell your personal data to third parties. Your information stays within Calo Cal to provide you with personalized insights."
        },
        {
            icon: <FileText className="w-5 h-5 text-orange-500" />,
            title: t('privacy.rights') || "Your Rights",
            content: t('privacy.rightsDesc') || "You can export your data at any time from the Export section, or contact us to delete your account and all associated data."
        }
    ];

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
                <h1 className="text-xl font-display font-bold text-foreground">{t('profile.privacy')}</h1>
            </header>

            <div className="px-5 space-y-6 pt-4">
                <div className="bg-primary/10 p-6 rounded-3xl border border-primary/20 mb-8 text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground mb-2">{t('privacy.title') || "Your Privacy Matters"}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {t('privacy.intro') || "At Calo Cal, we believe your health data is personal. This policy outlines how we protect and manage your information."}
                    </p>
                </div>

                <div className="space-y-4">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-card border border-white/5 p-5 rounded-2xl flex gap-4"
                        >
                            <div className="shrink-0 mt-1">
                                {section.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground mb-1">{section.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {section.content}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="pt-8 text-center">
                    <p className="text-xs text-muted-foreground">
                        Last Updated: March 2024
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default PrivacyScreen;
