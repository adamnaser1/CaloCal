import { useState } from "react";
import { X, ArrowRight, Loader2, Search } from "lucide-react";
import { lookupBarcode } from "@/services/barcodeService";
import { useToast } from "@/hooks/use-toast";

interface ManualBarcodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onFound: (product: any) => void;
}

export function ManualBarcodeModal({ isOpen, onClose, onFound }: ManualBarcodeModalProps) {
    const [barcode, setBarcode] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    if (!isOpen) return null;

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!barcode) return;

        setLoading(true);
        try {
            const product = await lookupBarcode(barcode);
            if (product) {
                onFound({
                    code: barcode,
                    product: product
                }); // Match structure expected by Scanner
                onClose();
                setBarcode("");
            } else {
                toast({
                    variant: "destructive",
                    title: "Product not found",
                    description: "Try scanning again or enter manually."
                });
            }
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error searching product",
                description: "Please check your connection."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
            <div
                className="w-full max-w-md rounded-t-[32px] bg-background p-6 animate-in slide-in-from-bottom"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-display text-xl font-bold">Enter barcode</h2>
                    <button onClick={onClose} className="rounded-full bg-secondary p-2">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSearch} className="space-y-6">
                    <div className="space-y-2">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <input
                                autoFocus
                                type="text"
                                inputMode="numeric"
                                maxLength={13}
                                placeholder="e.g. 3033490004751"
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value.replace(/\D/g, ''))}
                                className="w-full rounded-2xl border border-border bg-secondary/30 py-4 pl-12 pr-4 text-lg font-bold tracking-widest outline-none focus:border-primary focus:bg-background"
                            />
                        </div>
                        <p className="px-1 text-xs text-muted-foreground">Enter the 8 or 13-digit EAN code found on the package.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={!barcode || loading}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F5C518] py-4 font-display font-bold text-foreground transition-transform active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search Product"}
                        {!loading && <ArrowRight className="h-5 w-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
