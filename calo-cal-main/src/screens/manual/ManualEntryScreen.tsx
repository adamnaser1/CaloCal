import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Clock, Plus, Flame, X, Minus, Trash2 } from "lucide-react";
import { saveMealLog, getMealType } from "@/services/mealsService";
import { IngredientSearchModal } from "@/components/IngredientSearchModal";
import { useToast } from "@/hooks/use-toast";
import { formatCalories } from "@/lib/utils";

interface Ingredient {
    name: string;
    quantity_g: number;
    calories_per_100g: number;
    proteins_per_100g: number;
    carbs_per_100g: number;
    fats_per_100g: number;
}

export default function ManualEntryScreen() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const location = useLocation();
    // Existing data if editing (though editing logic usually goes to MealDetailScreen? 
    // Prompt says "existingMeal (optional, for editing)". We will handle it.)
    const existingMeal = location.state?.existingMeal;

    const [mealName, setMealName] = useState(existingMeal?.custom_name || "");
    const [mealType, setMealType] = useState(existingMeal?.meal_type || getMealType());
    const [time, setTime] = useState(
        existingMeal?.logged_at ? new Date(existingMeal.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
            new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );

    const [useTotalCalories, setUseTotalCalories] = useState(false);
    const [totalCalories, setTotalCalories] = useState<string>(existingMeal?.total_calories?.toString() || "");
    const [ingredients, setIngredients] = useState<Ingredient[]>(existingMeal?.items || []);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const calculatedCalories = ingredients.reduce((sum, item) => sum + (item.calories_per_100g * item.quantity_g / 100), 0);
    const displayCalories = useTotalCalories ? parseInt(totalCalories || "0") : Math.round(calculatedCalories);

    const handleAddIngredient = (item: any) => {
        setIngredients([...ingredients, {
            name: item.name_fr || item.name, // Handle different objects
            quantity_g: 100, // Default
            calories_per_100g: item.calories_per_100g,
            proteins_per_100g: item.proteins_per_100g,
            carbs_per_100g: item.carbs_per_100g,
            fats_per_100g: item.fats_per_100g
        }]);
    };

    const updateQuantity = (index: number, delta: number) => {
        const newIngredients = [...ingredients];
        newIngredients[index].quantity_g = Math.max(0, newIngredients[index].quantity_g + delta);
        setIngredients(newIngredients);
    };

    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!mealName.trim()) {
            toast({ title: "Please enter a meal name", variant: "destructive" });
            return;
        }
        if (!useTotalCalories && ingredients.length === 0) {
            toast({ title: "Please add ingredients or set total calories", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const totalProt = useTotalCalories ? 0 : ingredients.reduce((sum, item) => sum + (item.proteins_per_100g * item.quantity_g / 100), 0);
            const totalCarbs = useTotalCalories ? 0 : ingredients.reduce((sum, item) => sum + (item.carbs_per_100g * item.quantity_g / 100), 0);
            const totalFats = useTotalCalories ? 0 : ingredients.reduce((sum, item) => sum + (item.fats_per_100g * item.quantity_g / 100), 0);

            await saveMealLog({
                meal_type: mealType,
                input_method: 'manual',
                total_calories: displayCalories,
                total_proteins: Math.round(totalProt),
                total_carbs: Math.round(totalCarbs),
                total_fats: Math.round(totalFats),
                items: ingredients.map(i => ({
                    custom_name: i.name,
                    quantity_g: i.quantity_g,
                    calories: Math.round(i.calories_per_100g * i.quantity_g / 100),
                    proteins: Math.round(i.proteins_per_100g * i.quantity_g / 100),
                    carbs: Math.round(i.carbs_per_100g * i.quantity_g / 100),
                    fats: Math.round(i.fats_per_100g * i.quantity_g / 100),
                }))
            });

            toast({ title: "Meal saved!" });
            navigate('/diary');
        } catch (e) {
            toast({ title: "Failed to save", variant: "destructive" });
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Header */}
            <div className="flex items-center gap-4 px-5 pt-6 pb-2">
                <button onClick={() => navigate(-1)} className="rounded-full bg-secondary p-2">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="font-display text-xl font-bold">Add meal manually</h1>
            </div>

            <div className="space-y-6 px-5 pt-6">
                {/* Meal Name */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">What did you eat?</label>
                    <input
                        type="text"
                        placeholder="e.g. Couscous au poulet"
                        value={mealName}
                        onChange={(e) => setMealName(e.target.value)}
                        className="w-full rounded-2xl border border-transparent bg-secondary/50 px-5 py-4 font-display text-lg font-bold outline-none focus:border-primary focus:bg-background"
                    />
                </div>

                {/* Meal Type */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Meal Type</label>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {['breakfast', 'lunch', 'dinner', 'snack'].map(type => (
                            <button
                                key={type}
                                onClick={() => setMealType(type as any)}
                                className={`rounded-full px-5 py-2.5 text-sm font-bold capitalize transition-colors ${mealType === type
                                        ? 'bg-[#F5C518] text-foreground'
                                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Time</label>
                    <div className="flex items-center gap-3 rounded-2xl bg-secondary/30 px-5 py-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="bg-transparent font-medium outline-none"
                        />
                    </div>
                </div>

                <div className="h-px bg-border/50" />

                {/* Mode Toggle */}
                <div className="flex items-center justify-between">
                    <span className="font-bold">I know the total calories</span>
                    <button
                        onClick={() => setUseTotalCalories(!useTotalCalories)}
                        className={`h-6 w-11 rounded-full transition-colors ${useTotalCalories ? 'bg-[#F5C518]' : 'bg-secondary'}`}
                    >
                        <div className={`h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${useTotalCalories ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                </div>

                {useTotalCalories ? (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-3 rounded-2xl bg-secondary/30 px-5 py-4">
                            <Flame className="h-5 w-5 text-[#F5C518]" />
                            <input
                                type="number"
                                placeholder="0"
                                value={totalCalories}
                                onChange={(e) => setTotalCalories(e.target.value)}
                                className="w-full bg-transparent text-lg font-bold outline-none"
                            />
                            <span className="font-medium text-muted-foreground">kcal</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold">Ingredients</h3>
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="flex items-center gap-1 text-sm font-bold text-[#F5C518]"
                            >
                                <Plus className="h-4 w-4" />
                                Add item
                            </button>
                        </div>

                        {ingredients.length === 0 ? (
                            <div className="rounded-2xl border-2 border-dashed border-border/50 py-8 text-center">
                                <p className="text-sm text-muted-foreground">No ingredients added</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {ingredients.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
                                        <div className="flex-1">
                                            <p className="font-bold">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {Math.round(item.calories_per_100g * item.quantity_g / 100)} kcal
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => updateQuantity(idx, -10)} className="rounded-full bg-secondary p-1">
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="w-12 text-center text-sm font-medium">{item.quantity_g}g</span>
                                            <button onClick={() => updateQuantity(idx, 10)} className="rounded-full bg-secondary p-1">
                                                <Plus className="h-3 w-3" />
                                            </button>
                                            <button onClick={() => removeIngredient(idx)} className="ml-1 text-muted-foreground hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <div className="mt-4 flex justify-between border-t border-border/50 pt-4">
                                    <span className="font-medium text-muted-foreground">Total calculated</span>
                                    <span className="text-xl font-bold">{formatCalories(calculatedCalories)} kcal</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="fixed bottom-8 left-0 right-0 px-5">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full rounded-full bg-[#F5C518] py-4 font-display font-bold text-foreground shadow-lg shadow-yellow-500/20 disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save Log"}
                </button>
            </div>

            <IngredientSearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSelect={handleAddIngredient}
            />
        </div>
    );
}
