import { useState, useEffect } from "react";
import { Search, X, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useDebounce } from "@/hooks/use-debounce";
import { CustomIngredientModal } from "./CustomIngredientModal";

interface IngredientSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (item: any) => void;
}

export function IngredientSearchModal({ isOpen, onClose, onSelect }: IngredientSearchModalProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showCustom, setShowCustom] = useState(false);
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        async function search() {
            if (!debouncedQuery) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const { data } = await supabase
                    .from("food_items")
                    .select("*")
                    .or(`name_fr.ilike.%${debouncedQuery}%,name_ar.ilike.%${debouncedQuery}%`)
                    .limit(20);
                setResults(data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        search();
    }, [debouncedQuery]);

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center">
                <div className="flex h-[80vh] w-full max-w-md flex-col rounded-t-[32px] bg-background active:scale-100 sm:rounded-[32px]">
                    {/* Header */}
                    <div className="flex items-center gap-3 border-b p-4">
                        <Search className="h-5 w-5 text-muted-foreground" />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search ingredients (e.g. Chicken, Tomate)"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 bg-transparent font-medium outline-none placeholder:text-muted-foreground"
                        />
                        <button onClick={onClose} className="rounded-full bg-secondary p-2">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-2">
                        {loading ? (
                            <p className="py-8 text-center text-sm text-muted-foreground">Searching...</p>
                        ) : results.length > 0 ? (
                            <div className="space-y-1">
                                {results.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            onSelect({
                                                name: item.name_fr || item.name_ar,
                                                ...item
                                            });
                                            onClose();
                                        }}
                                        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left hover:bg-secondary/50"
                                    >
                                        <div>
                                            <p className="font-bold text-foreground">{item.name_fr}</p>
                                            <p className="text-xs text-muted-foreground">{item.name_ar}</p>
                                        </div>
                                        <div className="text-right text-xs text-muted-foreground">
                                            <p>{item.calories_per_100g} kcal</p>
                                            <p>per 100g</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : query ? (
                            <div className="flex flex-col items-center justify-center py-10">
                                <p className="mb-4 text-sm text-muted-foreground">No matches found</p>
                                <button
                                    onClick={() => setShowCustom(true)}
                                    className="flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-bold text-foreground hover:bg-secondary/80"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Custom Ingredient
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <p className="text-sm text-muted-foreground">Type to search existing foods</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CustomIngredientModal
                isOpen={showCustom}
                onClose={() => setShowCustom(false)}
                onAdd={(item) => {
                    onSelect(item);
                    onClose(); // Close search modal too
                }}
            />
        </>
    );
}
