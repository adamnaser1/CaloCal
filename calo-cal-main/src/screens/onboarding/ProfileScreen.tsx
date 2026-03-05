import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ProfileScreen = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        age: "",
        sex: "" as "male" | "female" | "",
        height: "",
        currentWeight: "",
        targetWeight: "",
    });

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const isValid =
        formData.age &&
        formData.sex &&
        formData.height &&
        formData.currentWeight &&
        formData.targetWeight;

    const handleContinue = () => {
        if (isValid) {
            localStorage.setItem("onboarding_profile", JSON.stringify({
                age: formData.age,
                sex: formData.sex,
                heightCm: formData.height,
                currentWeightKg: formData.currentWeight,
                targetWeightKg: formData.targetWeight
            }));
            navigate("/onboarding/calories");
        }
    };

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
                    <div className="h-1.5 flex-1 rounded-full bg-border" />
                </div>
                <div className="w-6" />
            </header>

            <div className="px-5 pt-6">
                <h1 className="mb-2 font-display text-[28px] font-bold text-foreground">Tell us about you</h1>
                <p className="mb-8 font-body text-sm text-muted-foreground">Used to calculate your calorie goal</p>

                <div className="flex flex-col gap-5">
                    {/* Age */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Age</label>
                        <input
                            type="number"
                            placeholder="25"
                            value={formData.age}
                            onChange={(e) => handleChange("age", e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-body outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518]"
                        />
                    </div>

                    {/* Sex */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Biological sex</label>
                        <div className="flex gap-3">
                            {(["male", "female"] as const).map((sex) => (
                                <button
                                    key={sex}
                                    onClick={() => handleChange("sex", sex)}
                                    className={`flex-1 rounded-full py-3 text-sm font-bold capitalize transition-colors ${formData.sex === sex
                                            ? "bg-[#F5C518] text-foreground"
                                            : "bg-gray-100 text-muted-foreground hover:bg-gray-200"
                                        }`}
                                >
                                    {sex}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Height */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Height (cm)</label>
                        <input
                            type="number"
                            placeholder="175"
                            value={formData.height}
                            onChange={(e) => handleChange("height", e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-body outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518]"
                        />
                    </div>

                    {/* Current Weight */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Current weight (kg)</label>
                        <input
                            type="number"
                            placeholder="75"
                            value={formData.currentWeight}
                            onChange={(e) => handleChange("currentWeight", e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-body outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518]"
                        />
                    </div>

                    {/* Target Weight */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Target weight (kg)</label>
                        <input
                            type="number"
                            placeholder="70"
                            value={formData.targetWeight}
                            onChange={(e) => handleChange("targetWeight", e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-body outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518]"
                        />
                    </div>
                </div>
            </div>

            <div className="fixed bottom-8 left-0 right-0 px-5">
                <button
                    onClick={handleContinue}
                    disabled={!isValid}
                    className="w-full rounded-full bg-[#F5C518] py-4 font-display font-bold text-foreground transition-opacity disabled:opacity-40"
                >
                    Continue →
                </button>
            </div>
        </div>
    );
};

export default ProfileScreen;
