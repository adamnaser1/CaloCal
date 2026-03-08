import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, FileJson } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function ExportDataScreen() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
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

            toast({ title: "Data exported ✓", description: "JSON file downloaded" });
        } catch (e) {
            toast({ variant: "destructive", title: "Export failed" });
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="flex items-center gap-4 px-5 pt-6 pb-6">
                <button onClick={() => navigate(-1)} className="rounded-full bg-secondary p-2">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="font-display text-xl font-bold">Export Data</h1>
            </header>

            <div className="px-5 flex flex-col items-center justify-center pt-10 text-center">
                <div className="mb-6 rounded-full bg-secondary p-8">
                    <FileJson className="h-16 w-16 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Download your data</h2>
                <p className="text-muted-foreground mb-12 max-w-xs">
                    Get a copy of all your meal logs and profile information in JSON format.
                </p>

                <div className="w-full bg-secondary/30 rounded-2xl p-4 mb-8 text-left">
                    <h3 className="font-bold mb-3 text-sm uppercase text-muted-foreground">What's included?</h3>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-sm font-medium">
                            <span className="text-green-500">✓</span> Profile details (height, weight, goals)
                        </li>
                        <li className="flex items-center gap-2 text-sm font-medium">
                            <span className="text-green-500">✓</span> Complete meal history
                        </li>
                        <li className="flex items-center gap-2 text-sm font-medium">
                            <span className="text-green-500">✓</span> Ingredient breakdowns
                        </li>
                        <li className="flex items-center gap-2 text-sm font-medium">
                            <span className="text-green-500">✓</span> Analysis timestamps
                        </li>
                    </ul>
                </div>

                <button
                    onClick={handleExport}
                    disabled={exporting}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-[#F5C518] py-4 font-display font-bold text-foreground shadow-lg disabled:opacity-50"
                >
                    {exporting ? "Generating..." : "Download JSON"}
                    {!exporting && <Download className="h-5 w-5" />}
                </button>
            </div>
        </div>
    );
}
