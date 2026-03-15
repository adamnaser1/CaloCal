import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, FileJson } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function ExportDataScreen() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const { t } = useLanguage();
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        if (!user) return;
        setExporting(true);
        try {
            const [profile, { data: meals }] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', user.id).single(),
                supabase.from('meal_logs').select('*, meal_items(*)').eq('user_id', user.id)
            ]);

            const exportData = {
                exportedAt: new Date().toISOString(),
                profile: profile.data,
                mealLogs: meals || []
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `calo-cal-export-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);

            toast({ title: t('exportData.successTitle') || "Data exported ✓", description: t('exportData.successDesc') || "JSON file downloaded" });
        } catch (e) {
            toast({ variant: "destructive", title: t('exportData.errorTitle') || "Export failed" });
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="flex items-center gap-4 px-5 pt-8 pb-4 border-b dark:border-white/10 bg-background sticky top-0 z-20">
                <button onClick={() => navigate(-1)} className="rounded-full bg-secondary p-2 transition-transform active:scale-95">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="font-display text-xl font-bold">{t('exportData')}</h1>
            </header>

            <div className="px-5 flex flex-col items-center justify-center pt-10 text-center max-w-lg mx-auto">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8 rounded-[2rem] bg-secondary p-10 shadow-inner"
                >
                    <FileJson className="h-20 w-20 text-primary" />
                </motion.div>
                <h2 className="text-2xl font-display font-black mb-2">{t('downloadData')}</h2>
                <p className="text-muted-foreground mb-12 max-w-xs leading-relaxed">
                    {t('exportDescription')}
                </p>

                <div className="w-full bg-secondary/30 rounded-3xl p-6 mb-10 text-left border border-white/5 shadow-sm">
                    <h3 className="font-black mb-4 text-[10px] uppercase tracking-widest text-muted-foreground">{t('whatsIncluded')}</h3>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3 text-sm font-semibold text-foreground/80">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">✓</span>
                            {t('profileDetails')}
                        </li>
                        <li className="flex items-center gap-3 text-sm font-semibold text-foreground/80">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">✓</span>
                            {t('completeHistory')}
                        </li>
                        <li className="flex items-center gap-3 text-sm font-semibold text-foreground/80">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">✓</span>
                            {t('ingredientBreakdowns')}
                        </li>
                    </ul>
                </div>

                <button
                    onClick={handleExport}
                    disabled={exporting}
                    className="w-full flex items-center justify-center gap-3 rounded-2xl bg-primary py-5 font-display font-black text-foreground shadow-xl disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    {exporting ? t('generating') : t('downloadJson')}
                    {!exporting && <Download className="h-5 w-5" />}
                </button>
            </div>
        </div>
    );
}
