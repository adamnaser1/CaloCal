import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Minus, User } from "lucide-react";

const activityLevels = [
    { id: 'sedentary', label: 'Sedentary', desc: 'Little/no exercise' },
    { id: 'lightly_active', label: 'Lightly Active', desc: '1-3 days/week' },
    { id: 'moderately_active', label: 'Moderately Active', desc: '3-5 days/week' },
    { id: 'very_active', label: 'Very Active', desc: '6-7 days/week' },
    { id: 'extremely_active', label: 'Extremely Active', desc: 'Athlete' }
];

const ProfileScreen = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        age: 25,
        sex: "" as "male" | "female" | "",
        height: "",
        heightUnit: "cm" as "cm" | "ft",
        currentWeight: "",
        weightUnit: "kg" as "kg" | "lbs",
        targetWeight: "",
        targetWeightUnit: "kg" as "kg" | "lbs",
        activityLevel: ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: string, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Derived values for kg/cm calculation to save properly and show the difference
    const currentWeightKgStr = useMemo(() => {
        if (!formData.currentWeight) return "";
        const val = parseFloat(formData.currentWeight);
        if (isNaN(val)) return "";
        return formData.weightUnit === "kg" ? val : val / 2.205;
    }, [formData.currentWeight, formData.weightUnit]);

    const targetWeightKgStr = useMemo(() => {
        if (!formData.targetWeight) return "";
        const val = parseFloat(formData.targetWeight);
        if (isNaN(val)) return "";
        return formData.targetWeightUnit === "kg" ? val : val / 2.205;
    }, [formData.targetWeight, formData.targetWeightUnit]);

    const weightDifference = useMemo(() => {
        if (currentWeightKgStr === "" || targetWeightKgStr === "") return null;
        return (targetWeightKgStr as number) - (currentWeightKgStr as number);
    }, [currentWeightKgStr, targetWeightKgStr]);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (formData.fullName.length < 2) {
            newErrors.fullName = "Name must be at least 2 characters.";
        }
        if (formData.age < 13 || formData.age > 100) {
            newErrors.age = "Age must be between 13 and 100.";
        }
        if (!formData.sex) {
            newErrors.sex = "Please select your biological sex.";
        }

        const heightVal = parseFloat(formData.height);
        if (isNaN(heightVal)) {
            newErrors.height = "Height is required.";
        } else if (formData.heightUnit === "cm" && (heightVal < 100 || heightVal > 250)) {
            newErrors.height = "Height must be between 100cm and 250cm.";
        } else if (formData.heightUnit === "ft" && (heightVal < 3.3 || heightVal > 8.2)) {
            newErrors.height = "Height must be between 3.3ft and 8.2ft.";
        }

        const cwVal = parseFloat(formData.currentWeight);
        if (isNaN(cwVal)) {
            newErrors.currentWeight = "Current weight is required.";
        } else if (formData.weightUnit === "kg" && (cwVal < 30 || cwVal > 300)) {
            newErrors.currentWeight = "Weight must be between 30kg and 300kg.";
        } else if (formData.weightUnit === "lbs" && (cwVal < 66 || cwVal > 660)) {
            newErrors.currentWeight = "Weight must be between 66lbs and 660lbs.";
        }

        const twVal = parseFloat(formData.targetWeight);
        if (isNaN(twVal)) {
            newErrors.targetWeight = "Target weight is required.";
        } else if (formData.targetWeightUnit === "kg" && (twVal < 30 || twVal > 300)) {
            newErrors.targetWeight = "Target weight must be between 30kg and 300kg.";
        } else if (formData.targetWeightUnit === "lbs" && (twVal < 66 || twVal > 660)) {
            newErrors.targetWeight = "Target weight must be between 66lbs and 660lbs.";
        }

        if (weightDifference !== null && (weightDifference < -50 || weightDifference > 50)) {
            newErrors.targetWeight = "Target weight must be within ±50kg of current weight.";
        }

        if (!formData.activityLevel) {
            newErrors.activityLevel = "Please select your activity level.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isFormValid = useMemo(() => {
        return (
            formData.fullName.length >= 2 &&
            formData.age >= 13 && formData.age <= 100 &&
            formData.sex !== "" &&
            formData.height !== "" &&
            formData.currentWeight !== "" &&
            formData.targetWeight !== "" &&
            formData.activityLevel !== "" &&
            weightDifference !== null && weightDifference >= -50 && weightDifference <= 50
        );
    }, [formData, weightDifference]);


    const handleContinue = () => {
        if (validate()) {
            let heightCmVal = parseFloat(formData.height);
            if (formData.heightUnit === "ft") {
                heightCmVal = heightCmVal * 30.48;
            }

            localStorage.setItem("onboarding_profile", JSON.stringify({
                full_name: formData.fullName,
                age: formData.age,
                sex: formData.sex,
                height_cm: heightCmVal,
                current_weight_kg: currentWeightKgStr,
                target_weight_kg: targetWeightKgStr,
                activity_level: formData.activityLevel
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
                <p className="mb-8 font-body text-sm text-muted-foreground">Used to personalize your plan.</p>

                <div className="flex flex-col gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Full Name</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                👤
                            </span>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={formData.fullName}
                                onChange={(e) => handleChange("fullName", e.target.value)}
                                className={`w-full rounded-xl border ${errors.fullName ? "border-red-500" : "border-gray-200"} bg-gray-50 pl-12 pr-4 py-3 font-body outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518]`}
                            />
                        </div>
                        {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
                    </div>

                    {/* Age */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Age</label>
                        <div className="flex items-center w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2">
                            <button
                                onClick={() => handleChange("age", Math.max(13, formData.age - 1))}
                                className="p-2 text-gray-500 hover:text-gray-700"
                            >
                                <Minus size={20} />
                            </button>
                            <input
                                type="number"
                                value={formData.age}
                                onChange={(e) => handleChange("age", parseInt(e.target.value) || 0)}
                                className="flex-1 bg-transparent text-center font-bold text-lg outline-none"
                            />
                            <button
                                onClick={() => handleChange("age", Math.min(100, formData.age + 1))}
                                className="p-2 text-gray-500 hover:text-gray-700"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        {errors.age && <p className="text-xs text-red-500">{errors.age}</p>}
                    </div>

                    {/* Sex */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Biological sex</label>
                        <div className="flex gap-3">
                            {(["male", "female"] as const).map((sex) => (
                                <button
                                    key={sex}
                                    onClick={() => handleChange("sex", sex)}
                                    className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-bold capitalize transition-colors ${formData.sex === sex
                                        ? "bg-[#F5C518] text-foreground"
                                        : "bg-gray-100 text-muted-foreground hover:bg-gray-200"
                                        }`}
                                >
                                    <span>{sex === "male" ? "🚹" : "🚺"}</span>
                                    {sex}
                                </button>
                            ))}
                        </div>
                        {errors.sex && <p className="text-xs text-red-500">{errors.sex}</p>}
                    </div>

                    {/* Height */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Height</label>
                            <div className="flex bg-gray-100 rounded-md overflow-hidden">
                                <button
                                    className={`px-3 py-1 text-xs font-bold ${formData.heightUnit === "cm" ? "bg-gray-300 text-gray-800" : "text-gray-500"}`}
                                    onClick={() => handleChange("heightUnit", "cm")}
                                >
                                    cm
                                </button>
                                <button
                                    className={`px-3 py-1 text-xs font-bold ${formData.heightUnit === "ft" ? "bg-gray-300 text-gray-800" : "text-gray-500"}`}
                                    onClick={() => handleChange("heightUnit", "ft")}
                                >
                                    ft
                                </button>
                            </div>
                        </div>
                        <input
                            type="number"
                            step={formData.heightUnit === "ft" ? "0.1" : "1"}
                            placeholder={formData.heightUnit === "cm" ? "175" : "5.9"}
                            value={formData.height}
                            onChange={(e) => handleChange("height", e.target.value)}
                            className={`w-full rounded-xl border ${errors.height ? "border-red-500" : "border-gray-200"} bg-gray-50 px-4 py-3 font-body outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518]`}
                        />
                        {errors.height && <p className="text-xs text-red-500">{errors.height}</p>}
                    </div>

                    {/* Current Weight */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Current weight</label>
                            <div className="flex bg-gray-100 rounded-md overflow-hidden">
                                <button
                                    className={`px-3 py-1 text-xs font-bold ${formData.weightUnit === "kg" ? "bg-gray-300 text-gray-800" : "text-gray-500"}`}
                                    onClick={() => handleChange("weightUnit", "kg")}
                                >
                                    kg
                                </button>
                                <button
                                    className={`px-3 py-1 text-xs font-bold ${formData.weightUnit === "lbs" ? "bg-gray-300 text-gray-800" : "text-gray-500"}`}
                                    onClick={() => handleChange("weightUnit", "lbs")}
                                >
                                    lbs
                                </button>
                            </div>
                        </div>
                        <input
                            type="number"
                            placeholder={formData.weightUnit === "kg" ? "75" : "165"}
                            value={formData.currentWeight}
                            onChange={(e) => handleChange("currentWeight", e.target.value)}
                            className={`w-full rounded-xl border ${errors.currentWeight ? "border-red-500" : "border-gray-200"} bg-gray-50 px-4 py-3 font-body outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518]`}
                        />
                        {errors.currentWeight && <p className="text-xs text-red-500">{errors.currentWeight}</p>}
                    </div>

                    {/* Target Weight */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Target weight</label>
                            <div className="flex bg-gray-100 rounded-md overflow-hidden">
                                <button
                                    className={`px-3 py-1 text-xs font-bold ${formData.targetWeightUnit === "kg" ? "bg-gray-300 text-gray-800" : "text-gray-500"}`}
                                    onClick={() => handleChange("targetWeightUnit", "kg")}
                                >
                                    kg
                                </button>
                                <button
                                    className={`px-3 py-1 text-xs font-bold ${formData.targetWeightUnit === "lbs" ? "bg-gray-300 text-gray-800" : "text-gray-500"}`}
                                    onClick={() => handleChange("targetWeightUnit", "lbs")}
                                >
                                    lbs
                                </button>
                            </div>
                        </div>
                        <input
                            type="number"
                            placeholder={formData.targetWeightUnit === "kg" ? "70" : "154"}
                            value={formData.targetWeight}
                            onChange={(e) => handleChange("targetWeight", e.target.value)}
                            className={`w-full rounded-xl border ${errors.targetWeight ? "border-red-500" : "border-gray-200"} bg-gray-50 px-4 py-3 font-body outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518]`}
                        />
                        {weightDifference !== null && !isNaN(weightDifference) && (
                            <p className="text-xs font-bold text-gray-500 mt-1">
                                Goal: {weightDifference > 0 ? "+" : ""}{weightDifference.toFixed(1)} kg to {weightDifference > 0 ? "gain" : "lose"}
                            </p>
                        )}
                        {errors.targetWeight && <p className="text-xs text-red-500">{errors.targetWeight}</p>}
                    </div>

                    {/* Activity Level */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Activity level</label>
                        <div className="flex flex-col gap-2">
                            {activityLevels.map((level) => (
                                <button
                                    key={level.id}
                                    onClick={() => handleChange("activityLevel", level.id)}
                                    className={`flex items-center justify-between rounded-xl border p-3 text-left transition-colors ${formData.activityLevel === level.id
                                        ? "border-[#F5C518] bg-[#FFF9E0]"
                                        : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                >
                                    <span className="font-bold text-sm text-foreground">{level.label}</span>
                                    <span className="text-xs text-muted-foreground">{level.desc}</span>
                                </button>
                            ))}
                        </div>
                        {errors.activityLevel && <p className="text-xs text-red-500">{errors.activityLevel}</p>}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-8 left-0 right-0 px-5 z-50">
                <button
                    onClick={handleContinue}
                    disabled={!isFormValid}
                    className="w-full rounded-full bg-[#F5C518] py-4 font-display font-bold text-foreground transition-opacity disabled:opacity-40 shadow-lg"
                >
                    Continue →
                </button>
            </div>
        </div>
    );
};

export default ProfileScreen;
