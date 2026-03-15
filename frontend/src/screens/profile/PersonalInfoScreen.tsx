import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Check } from "lucide-react";
import { getUserProfile, updateUserProfile } from "@/services/profileService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";


const PersonalInfoScreen = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { refreshProfile } = useAuth();
    const { t } = useLanguage();


    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form fields
    const [fullName, setFullName] = useState("");
    const [age, setAge] = useState("");
    const [sex, setSex] = useState<"male" | "female">("male");
    const [height, setHeight] = useState("");
    const [currentWeight, setCurrentWeight] = useState("");
    const [targetWeight, setTargetWeight] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profile = await getUserProfile();
                if (profile) {
                    setFullName(profile.full_name || "");
                    setAge(profile.age?.toString() || "");
                    setSex((profile.sex as "male" | "female") || "male");
                    setHeight(profile.height_cm?.toString() || "");
                    setCurrentWeight(profile.current_weight_kg?.toString() || "");
                    setTargetWeight(profile.target_weight_kg?.toString() || "");
                }
            } catch (error) {
                console.error(error);
                toast({ variant: "destructive", title: t('common.error'), description: t('error.profileLoad') });
            } finally {

                setLoading(false);
            }
        };
        loadProfile();
    }, [toast]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateUserProfile({
                full_name: fullName,
                age: parseInt(age) || 0,
                sex,
                height_cm: Math.round(parseFloat(height)) || 0,
                current_weight_kg: parseFloat(currentWeight) || 0,
                target_weight_kg: parseFloat(targetWeight) || 0
            });

            await refreshProfile();

            toast({
                title: t('profile.photoUpdated'),
                variant: 'success',
                duration: 3000
            });

            navigate(-1);
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: t('common.error'),
                description: t('error.tryAgain'),
                duration: 5000
            });

        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-10">
            <header className="sticky top-0 z-10 flex items-center gap-4 bg-background/80 px-5 py-4 backdrop-blur-md">
                <button onClick={() => navigate(-1)} className="rounded-full bg-secondary p-2">
                    <ArrowLeft className="h-5 w-5 text-foreground" />
                </button>
                <h1 className="font-display text-lg font-bold text-foreground">{t('personalInfo.title')}</h1>

            </header>

            <div className="px-5 pt-4">
                <div className="space-y-6">
                    {/* Full Name */}
                    <div>
                        <label className="mb-2 block text-sm font-bold text-foreground">{t('personalInfo.fullName')}</label>

                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full rounded-2xl bg-secondary p-4 font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Age & Sex Row */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="mb-2 block text-sm font-bold text-foreground">{t('personalInfo.age')}</label>

                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="w-full rounded-2xl bg-secondary p-4 font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="mb-2 block text-sm font-bold text-foreground">{t('personalInfo.sex')}</label>

                            <div className="flex rounded-2xl bg-secondary p-1">
                                <button
                                    onClick={() => setSex("male")}
                                    className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${sex === "male"
                                        ? "bg-white text-black shadow-sm"
                                        : "text-muted-foreground"
                                        }`}
                                >
                                    {t('personalInfo.male')}

                                </button>
                                <button
                                    onClick={() => setSex("female")}
                                    className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${sex === "female"
                                        ? "bg-white text-black shadow-sm"
                                        : "text-muted-foreground"
                                        }`}
                                >
                                    {t('personalInfo.female')}

                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Height & Weights */}
                    <div>
                        <label className="mb-2 block text-sm font-bold text-foreground">{t('personalInfo.height')}</label>

                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="w-full rounded-2xl bg-secondary p-4 font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="mb-2 block text-sm font-bold text-foreground">{t('personalInfo.currentWeight')}</label>

                            <input
                                type="number"
                                value={currentWeight}
                                onChange={(e) => setCurrentWeight(e.target.value)}
                                className="w-full rounded-2xl bg-secondary p-4 font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="mb-2 block text-sm font-bold text-foreground">{t('personalInfo.targetWeight')}</label>

                            <input
                                type="number"
                                value={targetWeight}
                                onChange={(e) => setTargetWeight(e.target.value)}
                                className="w-full rounded-2xl bg-secondary p-4 font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-display font-bold text-primary-foreground shadow-fab active:scale-[0.98] disabled:opacity-70"
                >
                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : t('personalInfo.save')}

                    {!saving && <Check className="h-5 w-5" />}
                </button>
            </div>
        </div>
    );
};

export default PersonalInfoScreen;
