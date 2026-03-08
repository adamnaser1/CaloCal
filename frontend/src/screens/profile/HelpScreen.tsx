import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Info } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function HelpScreen() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background pb-10">
            <header className="flex items-center gap-4 px-5 pt-6 pb-6">
                <button onClick={() => navigate(-1)} className="rounded-full bg-secondary p-2">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="font-display text-xl font-bold">Help & FAQ</h1>
            </header>

            <div className="px-5 space-y-8">
                <section>
                    <div className="flex items-center gap-2 mb-4 text-[#F5C518]">
                        <Info className="h-5 w-5" />
                        <h2 className="font-bold text-foreground">Getting Started</h2>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>How do I track a meal?</AccordionTrigger>
                            <AccordionContent>
                                Tap the camera button in the center of the bottom navigation bar. You can take a photo, upload one, scan a barcode, or describe your meal with voice.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>What if the AI makes a mistake?</AccordionTrigger>
                            <AccordionContent>
                                After the AI estimates your meal, you can verify and edit the ingredients before saving. You can also edit saved meals from your diary.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-4 text-[#F5C518]">
                        <span className="text-xl">🍽️</span>
                        <h2 className="font-bold text-foreground">Tunisian Cuisine</h2>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Does it recognize Tunisian food?</AccordionTrigger>
                            <AccordionContent>
                                Yes! Our AI is specifically trained on Tunisian and North African dishes like Couscous, Brik, Lablabi, Ojja, and more.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>My dish isn't found</AccordionTrigger>
                            <AccordionContent>
                                If scanning doesn't work, try describing it with Voice Input ("Sahn Tounsi avec thon...") or add it manually using the "Add Custom Ingredient" feature.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-4 text-[#F5C518]">
                        <span className="text-xl">🔐</span>
                        <h2 className="font-bold text-foreground">Privacy & Data</h2>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-5">
                            <AccordionTrigger>Is my data private?</AccordionTrigger>
                            <AccordionContent>
                                Absolutely. Your data is stored securely and is only accessible by you. We do not sell your personal data.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>

                <div className="pt-8">
                    <a
                        href="mailto:support@calocal.app"
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary py-4 font-bold text-foreground hover:bg-secondary/80"
                    >
                        <Mail className="h-5 w-5" />
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}
