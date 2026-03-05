import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Minus, Plus, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { lookupBarcode, addBarcodeProductToLog, ProductInfo } from "@/services/barcodeService";
import { ManualBarcodeModal } from "@/components/ManualBarcodeModal";
import { useToast } from "@/hooks/use-toast";
import { useMealLog } from "@/context/MealLogContext";

// Types
type ScannerState = 'scanning' | 'found' | 'not_found' | 'adding' | 'error';

const BarcodeScannerScreen = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { refreshMeals } = useMealLog();

    // State
    const [state, setState] = useState<ScannerState>('scanning');
    const [scannedProduct, setScannedProduct] = useState<ProductInfo | null>(null);
    const [quantity, setQuantity] = useState(100);
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualBarcode, setManualBarcode] = useState("");

    // Calculated values
    const currentCalories = scannedProduct ? Math.round(scannedProduct.calories_per_100g * (quantity / 100)) : 0;
    const currentCarbs = scannedProduct ? Math.round(scannedProduct.carbs_per_100g * (quantity / 100)) : 0;
    const currentProteins = scannedProduct ? Math.round(scannedProduct.proteins_per_100g * (quantity / 100)) : 0;
    const currentFats = scannedProduct ? Math.round(scannedProduct.fats_per_100g * (quantity / 100)) : 0;

    const handleLookup = async (code: string) => {
        setState('adding'); // Temporary loading state for search logic reuse or 'scanning' with overlay? 
        // We'll keep 'scanning' visual but start logic. Or use intermediate state.
        // Let's use 'scanning' but with a loading indicator or just await.
        // Actually, let's switch to 'scanning' (no change) but ensure we handle the result.

        const info = await lookupBarcode(code);
        if (info) {
            setScannedProduct(info);
            setQuantity(100);
            setState('found');
        } else {
            setState('not_found');
        }
    };

    const handleAdd = async () => {
        if (!scannedProduct) return;
        setState('adding');
        try {
            await addBarcodeProductToLog(scannedProduct, quantity);
            await refreshMeals();
            toast({
                title: `${scannedProduct.name} added to your diary ✓`,
                variant: 'success',
                duration: 3000
            });
            navigate("/diary");
        } catch (e) {
            console.error(e);
            setState('error');
            toast({
                variant: "destructive",
                title: "Something went wrong.",
                description: "Could not add product.",
                duration: 5000
            });
            // Revert state handling?? state 'error' might define a UI.
            // Requirement says "Toast: Could not add product" for error state.
        }
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualBarcode.length > 3) {
            setShowManualInput(false);
            handleLookup(manualBarcode);
        }
    };

    // Reset flow
    const handleScanAnother = () => {
        setScannedProduct(null);
        setManualBarcode("");
        setState('scanning');
    };

    return (
        <div className="relative flex h-screen w-full flex-col bg-black text-white">
            {/* Viewfinder Layer */}
            <div className={`relative flex h-full w-full flex-col items-center justify-center p-8 transition-all duration-500 ${state === 'found' || state === 'not_found' ? 'h-1/2 opacity-50' : ''}`}>

                {/* Header within viewfinder */}
                <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6">
                    <button onClick={() => navigate(-1)} className="rounded-full bg-black/40 p-2 backdrop-blur-md">
                        <ArrowLeft className="h-6 w-6 text-white" />
                    </button>
                    {!showManualInput && (
                        <button onClick={() => setShowManualInput(true)} className="rounded-full bg-black/40 px-4 py-2 text-xs font-semibold backdrop-blur-md">
                            Enter manually
                        </button>
                    )}
                </div>

                {/* Focus Brackets */}
                <div className="relative aspect-square w-full max-w-[280px]">
                    {/* Corners */}
                    <div className="absolute top-0 left-0 h-8 w-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                    <div className="absolute top-0 right-0 h-8 w-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-primary rounded-br-xl" />

                    {/* Scanning Line Animation */}
                    {state === 'scanning' && (
                        <motion.div
                            className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(253,224,71,0.8)]"
                            animate={{ top: ['10%', '90%', '10%'] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        />
                    )}

                    {state === 'scanning' && (
                        <div className="absolute -bottom-12 left-0 right-0 text-center text-sm font-medium text-white/80">
                            Align barcode within the frame
                        </div>
                    )}
                </div>

                {/* Demo Button */}
                {state === 'scanning' && (
                    <div className="absolute bottom-12">
                        <button
                            onClick={() => handleLookup("3033490004751")}
                            className="rounded-full bg-yellow-400/20 px-4 py-2 text-xs font-bold text-yellow-200 border border-yellow-400/30 hover:bg-yellow-400/30"
                        >
                            🧪 Demo: scan Activia
                        </button>
                    </div>
                )}
            </div>

            {/* Bottom Sheet - Found/Not Found Layer */}
            <AnimatePresence>
                {(state === 'found' || state === 'not_found' || state === 'adding') && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute bottom-0 left-0 right-0 z-20 rounded-t-[32px] bg-background p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
                    >
                        <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-gray-200" />

                        {state === 'not_found' ? (
                            <div className="flex flex-col items-center py-8 text-center bg-background">
                                <div className="mb-4 rounded-full bg-gray-100 p-4">
                                    <span className="text-3xl">❓</span>
                                </div>
                                <h3 className="mb-2 font-display text-xl font-bold text-foreground">Product not found</h3>
                                <p className="mb-8 text-sm text-muted-foreground">This product isn't in our database yet</p>

                                <button className="mb-4 w-full rounded-2xl bg-primary py-4 font-display font-bold text-primary-foreground" onClick={() => navigate('/diary')}>
                                    Enter manually
                                </button>
                                <button className="w-full text-sm font-semibold text-muted-foreground" onClick={handleScanAnother}>
                                    Try again
                                </button>
                            </div>
                        ) : (
                            // Found State
                            <div className="flex flex-col bg-background">
                                <div className="mb-6 flex gap-4">
                                    {scannedProduct?.imageUrl ? (
                                        <img src={scannedProduct.imageUrl} alt={scannedProduct.name} className="h-24 w-24 rounded-xl object-contain bg-white border border-gray-100" />
                                    ) : (
                                        <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-gray-100 text-3xl">📦</div>
                                    )}
                                    <div className="flex-1">
                                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{scannedProduct?.brand}</div>
                                        <h2 className="font-display text-xl font-bold leading-tight text-foreground">{scannedProduct?.name}</h2>
                                        <div className="mt-2 inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                                            Per 100g: {scannedProduct?.calories_per_100g} kcal
                                        </div>
                                    </div>
                                </div>

                                {/* Macros */}
                                <div className="mb-6 grid grid-cols-3 gap-2">
                                    <div className="rounded-xl bg-orange-50 p-3 text-center">
                                        <div className="text-xs font-medium text-orange-600">Proteins</div>
                                        <div className="font-display text-lg font-bold text-orange-700">{Math.round(scannedProduct?.proteins_per_100g || 0)}g</div>
                                    </div>
                                    <div className="rounded-xl bg-blue-50 p-3 text-center">
                                        <div className="text-xs font-medium text-blue-600">Carbs</div>
                                        <div className="font-display text-lg font-bold text-blue-700">{Math.round(scannedProduct?.carbs_per_100g || 0)}g</div>
                                    </div>
                                    <div className="rounded-xl bg-green-50 p-3 text-center">
                                        <div className="text-xs font-medium text-green-600">Fats</div>
                                        <div className="font-display text-lg font-bold text-green-700">{Math.round(scannedProduct?.fats_per_100g || 0)}g</div>
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div className="mb-6 flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setQuantity(Math.max(10, quantity - 10))}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm active:scale-95"
                                        >
                                            <Minus className="h-4 w-4 text-foreground" />
                                        </button>
                                        <div className="text-center w-16">
                                            <div className="font-display text-lg font-bold text-foreground">{quantity}g</div>
                                        </div>
                                        <button
                                            onClick={() => setQuantity(quantity + 10)}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm active:scale-95"
                                        >
                                            <Plus className="h-4 w-4 text-foreground" />
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-muted-foreground">Calories</div>
                                        <div className="font-display text-xl font-bold text-primary-foreground text-foreground">{currentCalories} kcal</div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <button
                                    onClick={handleAdd}
                                    disabled={state === 'adding'}
                                    className="mb-3 w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-display font-bold text-primary-foreground shadow-fab active:scale-[0.98] disabled:opacity-70"
                                >
                                    {state === 'adding' ? <Loader2 className="h-5 w-5 animate-spin" /> : "Add to diary"}
                                    {state !== 'adding' && <ArrowLeft className="h-4 w-4 rotate-180" />}
                                </button>
                                <button
                                    onClick={handleScanAnother}
                                    disabled={state === 'adding'}
                                    className="w-full text-sm font-semibold text-muted-foreground hover:text-foreground"
                                >
                                    Scan another
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Manual Entry Modal */}
            <ManualBarcodeModal
                isOpen={showManualInput}
                onClose={() => setShowManualInput(false)}
                onFound={(result) => {
                    handleLookup(result.code);
                }}
            />
        </div>
    );
};

export default BarcodeScannerScreen;
