import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Info, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function HelpScreen() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-background text-foreground pb-12">
            <header className="flex items-center gap-4 px-5 pt-6 pb-6 border-b dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="rounded-full bg-secondary p-2">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="font-display text-xl font-bold">{t('helpCenter')}</h1>
            </header>

            <div className="px-5 pt-6 max-w-2xl mx-auto space-y-8">
                {/* Search Bar Placeholder */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder={t('help.search')}
                        className="w-full bg-secondary/50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#F5C518]"
                    />

                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-10"
                >
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-[#F5C518]">
                                <Info className="h-5 w-5" />
                            </div>
                            <h2 className="font-display text-lg font-bold">{t('help.gettingStarted')}</h2>

                        </div>
                        <Accordion type="single" collapsible className="w-full bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-800 overflow-hidden shadow-sm">
                            <AccordionItem value="item-1" className="px-4 border-b dark:border-gray-800 last:border-0 hover:bg-secondary/10 transition-colors">
                                <AccordionTrigger className="text-left font-medium py-5">{t('help.faq1Q')}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                                    {t('help.faq1A')}
                                </AccordionContent>

                            </AccordionItem>
                            <AccordionItem value="item-2" className="px-4 border-b dark:border-gray-800 last:border-0 hover:bg-secondary/10 transition-colors">
                                <AccordionTrigger className="text-left font-medium py-5">{t('help.faq2Q')}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                                    {t('help.faq2A')}
                                </AccordionContent>

                            </AccordionItem>
                        </Accordion>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                                <span className="text-xl">🍽️</span>
                            </div>
                            <h2 className="font-display text-lg font-bold">{t('help.tunisianCuisine')}</h2>

                        </div>
                        <Accordion type="single" collapsible className="w-full bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-800 overflow-hidden shadow-sm">
                            <AccordionItem value="item-3" className="px-4 border-b dark:border-gray-800 last:border-0 hover:bg-secondary/10 transition-colors">
                                <AccordionTrigger className="text-left font-medium py-5">{t('help.faq3Q')}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                                    {t('help.faq3A')}
                                </AccordionContent>

                            </AccordionItem>
                            <AccordionItem value="item-4" className="px-4 border-b dark:border-gray-800 last:border-0 hover:bg-secondary/10 transition-colors">
                                <AccordionTrigger className="text-left font-medium py-5">{t('help.faq4Q')}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                                    {t('help.faq4A')}
                                </AccordionContent>

                            </AccordionItem>
                        </Accordion>
                    </section>

                    <div className="pt-8">
                        <a
                            href="mailto:support@calocal.app"
                            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-secondary py-5 font-bold text-foreground hover:bg-secondary/80 transition-all active:scale-[0.98]"
                        >
                            <Mail className="h-5 w-5" />
                            {t('help.contactSupport')}
                        </a>

                    </div>
                </motion.div>
            </div>
        </div>
    );
}

