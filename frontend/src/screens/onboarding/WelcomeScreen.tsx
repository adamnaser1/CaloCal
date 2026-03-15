import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Utensils, Zap, Barcode } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const WelcomeScreen = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }
        }
    };

    const iconVariants = {
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut" as any
            }
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0A0A0B] text-white">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-[#F5C518]/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-[#FDB366]/10 blur-[120px] rounded-full" />

            {/* Content Area */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative flex flex-1 flex-col items-center justify-center px-6 pt-20 pb-12"
            >
                {/* Brand Logo & Icon */}
                <motion.div variants={itemVariants} className="flex flex-col items-center gap-6">
                    <motion.div
                        variants={iconVariants}
                        animate="animate"
                        className="flex h-24 w-24 items-center justify-center rounded-[24px] bg-gradient-to-br from-[#F5C518] to-[#FDB366] shadow-[0_0_40px_rgba(245,197,24,0.3)]"
                    >
                        <span className="text-5xl">🔥</span>
                    </motion.div>

                    <div className="text-center">
                        <h1 className="font-display text-[48px] font-black tracking-tight leading-tight">
                            Calo <span className="text-[#F5C518]">Cal</span>
                        </h1>
                        <p className="mt-2 font-body text-lg text-white/60 tracking-wide font-medium">
                            {t('onboarding.welcomeTagline')}
                        </p>
                    </div>
                </motion.div>

                {/* Feature Pills */}
                <motion.div variants={itemVariants} className="mt-12 flex flex-wrap justify-center gap-3">
                    {[
                        { icon: <Utensils size={16} />, label: "Smart Vision" },
                        { icon: <Zap size={16} />, label: "Health AI" },
                        { icon: <Barcode size={16} />, label: "Local Food" }
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-2 px-4 backdrop-blur-md">
                            <span className="text-[#F5C518]">{feature.icon}</span>
                            <span className="text-sm font-semibold tracking-wide">{feature.label}</span>
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Bottom Interaction Area */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
                className="relative mt-auto w-full p-6 pb-12"
            >
                <div className="mx-auto max-w-[400px] flex flex-col gap-6">
                    <div className="space-y-3 text-center">
                        <h2 className="font-display text-[28px] font-bold leading-tight">
                            {t('onboarding.welcomeTitle')}
                        </h2>
                        <p className="font-body text-sm text-white/50 px-4 leading-relaxed">
                            {t('onboarding.welcomeSubtitle')}
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/signup")}
                            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#F5C518] py-5 font-display text-lg font-bold text-black transition-all shadow-[0_20px_40px_rgba(245,197,24,0.2)]"
                        >
                            <span className="z-10">{t('onboarding.getStarted')}</span>
                            <ArrowRight className="z-10 transition-transform group-hover:translate-x-1" size={20} />
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                        </motion.button>

                        <button
                            onClick={() => navigate("/login")}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 font-body font-bold text-white/80 transition-all hover:bg-white/10 hover:text-white"
                        >
                            {t('onboarding.alreadyAccount')}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default WelcomeScreen;
