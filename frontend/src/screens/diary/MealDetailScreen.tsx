import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MoreHorizontal, Minus, Plus, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMealLogById, updateMealItemQuantity, deleteMealItem, deleteMealLog } from "@/services/diaryService";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

import { getEmoji, getMealGradient } from "@/lib/ui-utils";

const MealDetailScreen = () => {
    const { mealLogId } = useParams<{ mealLogId: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: mealLog, isLoading } = useQuery({
        queryKey: ["mealLog", mealLogId],
        queryFn: () => getMealLogById(mealLogId!),
        enabled: !!mealLogId,
    });

    const updateItemMutation = useMutation({
        mutationFn: (vars: { id: string; qty: number; oldQty: number; oldCals: number; oldP: number; oldC; oldF: number }) =>
            updateMealItemQuantity(vars.id, vars.qty, vars.oldQty, vars.oldCals, vars.oldP, vars.oldC, vars.oldF),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mealLog", mealLogId] });
            queryClient.invalidateQueries({ queryKey: ["meals"] });
        },
        onError: () => {
            toast({ variant: "destructive", description: "Failed to update quantity" });
        }
    });

    const deleteItemMutation = useMutation({
        mutationFn: deleteMealItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mealLog", mealLogId] });
            queryClient.invalidateQueries({ queryKey: ["meals"] });
            toast({ description: "Ingredient removed" });

            // If we just deleted the last item, we should probably go back, 
            // but let the query update handle the 404/empty state or effect?
            // Actually diaryService might delete the log if empty.
        }
    });

    const deleteLogMutation = useMutation({
        mutationFn: deleteMealLog,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["meals"] });
            toast({ description: "Meal deleted" });
            navigate("/diary");
        }
    });

    // Handle deletion/missing log
    useEffect(() => {
        if (!isLoading && !mealLog) {
            navigate("/diary");
        }
    }, [isLoading, mealLog, navigate]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-[#F5C518]" />
            </div>
        );
    }

    if (!mealLog) return null; // handled by effect

    // Calculate percentages
    const totalMacros = mealLog.total_proteins + mealLog.total_carbs + mealLog.total_fats;
    const pPct = totalMacros ? (mealLog.total_proteins / totalMacros) * 100 : 0;
    const cPct = totalMacros ? (mealLog.total_carbs / totalMacros) * 100 : 0;
    const fPct = totalMacros ? (mealLog.total_fats / totalMacros) * 100 : 0;

    const getGradient = (type: string) => getMealGradient(type);

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-6 pb-4">
                <button onClick={() => navigate(-1)} className="rounded-full bg-white p-2 shadow-sm">
                    <ArrowLeft className="h-6 w-6 text-foreground" />
                </button>
                <h1 className="font-display text-lg font-bold capitalize text-foreground">
                    {mealLog.meal_items[0]?.custom_name || `${mealLog.meal_type} · ${new Date(mealLog.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                </h1>
                <button className="rounded-full bg-white p-2 shadow-sm">
                    <MoreHorizontal className="h-6 w-6 text-foreground" />
                </button>
            </div>

            <div className="px-5">
                {/* Photo/Placeholder */}
                <div className={`mb-6 h-[180px] w-full rounded-2xl bg-gradient-to-br ${getGradient(mealLog.meal_type)}`}>
                    {mealLog.photo_url ? (
                        <img src={mealLog.photo_url} alt="Meal" className="h-full w-full rounded-2xl object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-4xl opacity-50">
                            {getEmoji(mealLog.meal_items[0]?.custom_name || "Food")}
                        </div>
                    )}
                </div>

                {/* Totals Card */}
                <div className="mb-6 rounded-2xl bg-[#F5C518] p-5 text-foreground">
                    <h2 className="mb-1 font-display text-4xl font-bold">{mealLog.total_calories} kcal</h2>
                    <div className="flex items-center gap-2 text-xs font-medium opacity-80">
                        <span>{new Date(mealLog.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1 rounded-full bg-black/10 px-2 py-0.5">
                            {mealLog.input_method === 'photo' ? '📷' : '✏️'} {mealLog.input_method}
                        </div>
                    </div>
                </div>

                {/* Macros */}
                <div className="mb-8 flex flex-col gap-3">
                    <MacroBar color="bg-[#3B82F6]" label="Proteins" amount={mealLog.total_proteins} percent={pPct} />
                    <MacroBar color="bg-[#F5C518]" label="Carbs" amount={mealLog.total_carbs} percent={cPct} />
                    <MacroBar color="bg-[#22C55E]" label="Fats" amount={mealLog.total_fats} percent={fPct} />
                </div>

                {/* Ingredients */}
                <div className="mb-8">
                    <h3 className="mb-4 font-display text-lg font-bold text-foreground">Ingredients</h3>
                    <div className="flex flex-col gap-4">
                        {mealLog.meal_items.map(item => (
                            <IngredientRow
                                key={item.id}
                                item={item}
                                onUpdate={(newQty) => updateItemMutation.mutate({
                                    id: item.id, qty: newQty, oldQty: item.quantity_g,
                                    oldCals: item.calories, oldP: item.proteins, oldC: item.carbs, oldF: item.fats
                                })}
                                onDelete={() => deleteItemMutation.mutate(item.id)}
                            />
                        ))}
                    </div>

                    {/* Add stub */}
                    <div className="mt-4 flex items-center justify-center rounded-xl border border-dashed border-gray-300 py-3 text-sm font-medium text-muted-foreground">
                        + Add ingredient
                    </div>
                </div>

                {/* Delete Meal */}
                <button
                    onClick={() => {
                        if (window.confirm("Delete this meal?")) {
                            deleteLogMutation.mutate(mealLog.id);
                        }
                    }}
                    className="w-full text-center text-sm font-medium text-red-500 hover:text-red-600"
                >
                    Delete this meal
                </button>
            </div>
        </div>
    );
};

const MacroBar = ({ color, label, amount, percent }: { color: string, label: string, amount: number, percent: number }) => (
    <div className="flex items-center gap-3">
        <div className="w-16 text-sm font-medium text-muted-foreground">{label}</div>
        <div className="relative flex-1">
            <div className="h-2 w-full rounded-full bg-gray-100" />
            <div className={`absolute top-0 left-0 h-2 rounded-full ${color}`} style={{ width: `${Math.min(percent, 100)}%` }} />
        </div>
        <div className="w-10 text-right text-sm font-bold text-foreground">{amount}g</div>
    </div>
);

const IngredientRow = ({ item, onUpdate, onDelete }: { item: any, onUpdate: (q: number) => void, onDelete: () => void }) => {
    // Local state for optimistic stepper
    const [quantity, setQuantity] = useState(item.quantity_g);
    // Debounce ref
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleChange = (delta: number) => {
        const newQ = Math.max(10, quantity + delta);
        setQuantity(newQ);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            onUpdate(newQ);
        }, 800);
    };

    return (
        <motion.div
            className="relative overflow-hidden rounded-xl bg-gray-50 bg-white shadow-sm"
            drag="x"
            dragConstraints={{ left: -80, right: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
                if (info.offset.x < -60) onDelete();
            }}
        >
            <div className="absolute inset-y-0 right-0 flex w-20 items-center justify-center bg-red-500">
                <span className="text-xs font-bold text-white">Remove</span>
            </div>

            <div className="relative flex items-center justify-between bg-white p-3">
                <div className="flex items-center gap-3">
                    <span className="text-xl">{getEmoji(item.custom_name)}</span>
                    <div>
                        <div className="font-display text-sm font-bold text-foreground">{item.custom_name}</div>
                        <div className="text-xs text-muted-foreground">{quantity}g</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-sm font-bold text-foreground">{Math.round(item.calories * (quantity / item.quantity_g))} kcal</div>
                    <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-1">
                        <button onClick={() => handleChange(-10)} className="rounded-md bg-white p-1 shadow-sm hover:bg-gray-50">
                            <Minus size={12} />
                        </button>
                        <button onClick={() => handleChange(10)} className="rounded-md bg-white p-1 shadow-sm hover:bg-gray-50">
                            <Plus size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default MealDetailScreen;
