import { useState } from "react";
import { X, Check } from "lucide-react";

interface CustomIngredientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (item: any) => void;
}

export function CustomIngredientModal({ isOpen, onClose, onAdd }: CustomIngredientModalProps) {
    const [name, setName] = useState("");
    const [calories, setCalories] = useState("");
    const [proteins, setProteins] = useState("");
    const [carbs, setCarbs] = useState("");
    const [fats, setFats] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !calories) return;

        onAdd({
            name,
            calories_per_100g: parseFloat(calories),
            proteins_per_100g: parseFloat(proteins) || 0,
            carbs_per_100g: parseFloat(carbs) || 0,
            fats_per_100g: parseFloat(fats) || 0,
        });
        onClose();
        // Reset form
        setName("");
        setCalories("");
        setProteins("");
        setCarbs("");
        setFats("");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center">
            <div className="w-full max-w-md rounded-t-[32px] bg-background p-6 active:scale-100 sm:rounded-[32px]">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-display text-xl font-bold">Custom Ingredient</h2>
                    <button onClick={onClose} className="rounded-full bg-secondary p-2">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Name</label>
                        <input
                            autoFocus
                            type="text"
                            placeholder="e.g. Grandma's Sauce"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Calories (kcal)</label>
                            <input
                                type="number"
                                placeholder="100"
                                value={calories}
                                onChange={(e) => setCalories(e.target.value)}
                                className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Prot (g)</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={proteins}
                                onChange={(e) => setProteins(e.target.value)}
                                className="w-full rounded-xl border border-border bg-secondary/50 px-3 py-3 font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Carbs (g)</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={carbs}
                                onChange={(e) => setCarbs(e.target.value)}
                                className="w-full rounded-xl border border-border bg-secondary/50 px-3 py-3 font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Fats (g)</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={fats}
                                onChange={(e) => setFats(e.target.value)}
                                className="w-full rounded-xl border border-border bg-secondary/50 px-3 py-3 font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">* Values per 100g</p>

                    <button
                        type="submit"
                        disabled={!name || !calories}
                        className="mt-4 w-full rounded-xl bg-[#F5C518] py-4 font-bold text-foreground disabled:opacity-50"
                    >
                        Add Ingredient
                    </button>
                </form>
            </div>
        </div>
    );
}
