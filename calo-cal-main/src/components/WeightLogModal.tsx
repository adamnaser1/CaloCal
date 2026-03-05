import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Minus, Plus } from "lucide-react";
import { logWeight } from "@/services/progressService";
import { useToast } from "@/hooks/use-toast";

interface WeightLogModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void;
    currentWeight?: number;
}

const WeightLogModal = ({ isOpen, onClose, onSaved, currentWeight }: WeightLogModalProps) => {
    const { toast } = useToast();
    const [weight, setWeight] = useState(currentWeight || 70);
    const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
    const [note, setNote] = useState("");
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && currentWeight) {
            setWeight(currentWeight);
        }
    }, [isOpen, currentWeight]);

    const handleSave = async () => {
        setSaving(true);
        const weightInKg = unit === 'lbs' ? weight / 2.205 : weight;

        try {
            await logWeight(Math.round(weightInKg * 10) / 10, note || undefined);
            onSaved();
            onClose();
            toast({
                title: "Weight logged ✓",
                variant: 'success',
                duration: 3000
            });
        } catch (e: any) {
            toast({
                variant: "destructive",
                title: "Something went wrong.",
                description: "Please try again.",
                duration: 5000
            });
        } finally {
            setSaving(false);
        }
    };

    const adjustWeight = (amount: number) => {
        setWeight(prev => Math.round((prev + amount) * 10) / 10);
    };

    const startEditing = () => {
        setInputValue(weight.toFixed(1));
        setIsEditing(true);
        setTimeout(() => inputRef.current?.select(), 50);
    };

    const commitEdit = () => {
        const parsed = parseFloat(inputValue);
        if (!isNaN(parsed) && parsed > 0 && parsed < 700) {
            setWeight(Math.round(parsed * 10) / 10);
        }
        setIsEditing(false);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") commitEdit();
        if (e.key === "Escape") setIsEditing(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[28px] bg-white p-6 pb-10"
                    >
                        {/* Drag Handle */}
                        <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-gray-200" />

                        {/* Header */}
                        <div className="mb-8 text-center">
                            <h2 className="font-display text-xl font-bold text-foreground">Log your weight</h2>
                            <p className="mt-1 text-sm text-muted-foreground">Tap the number to type it directly</p>
                        </div>

                        {/* Weight Input */}
                        <div className="mb-8 flex flex-col items-center">
                            <div className="flex items-center gap-6">
                                {/* Decrement */}
                                <button
                                    onClick={() => adjustWeight(-0.1)}
                                    className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-foreground active:bg-gray-200"
                                >
                                    <Minus className="h-5 w-5" />
                                </button>

                                {/* Tappable / editable number */}
                                <div className="text-center min-w-[140px]">
                                    {isEditing ? (
                                        <input
                                            ref={inputRef}
                                            type="number"
                                            step="0.1"
                                            min="1"
                                            max="700"
                                            value={inputValue}
                                            onChange={e => setInputValue(e.target.value)}
                                            onBlur={commitEdit}
                                            onKeyDown={handleInputKeyDown}
                                            className="w-36 text-center font-display text-[56px] font-bold leading-none text-[#F5C518] bg-transparent border-b-2 border-[#F5C518] outline-none"
                                            autoFocus
                                        />
                                    ) : (
                                        <button
                                            onClick={startEditing}
                                            className="font-display text-[56px] font-bold leading-none text-[#F5C518] underline decoration-dashed decoration-[#F5C518]/50 underline-offset-4"
                                            title="Tap to type"
                                        >
                                            {weight.toFixed(1)}
                                        </button>
                                    )}
                                    <div className="mt-1 text-xs font-medium text-muted-foreground">tap to type</div>
                                </div>

                                {/* Increment */}
                                <button
                                    onClick={() => adjustWeight(0.1)}
                                    className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-foreground active:bg-gray-200"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Unit Toggle */}
                            <div className="mt-4 flex gap-1 rounded-full bg-gray-100 p-1">
                                <button
                                    onClick={() => setUnit('kg')}
                                    className={`rounded-full px-4 py-1 text-sm font-bold transition-all ${unit === 'kg' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground'}`}
                                >
                                    kg
                                </button>
                                <button
                                    onClick={() => setUnit('lbs')}
                                    className={`rounded-full px-4 py-1 text-sm font-bold transition-all ${unit === 'lbs' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground'}`}
                                >
                                    lbs
                                </button>
                            </div>
                        </div>

                        {/* Note Input */}
                        <div className="mb-8">
                            <textarea
                                placeholder="How are you feeling today? (optional)"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full resize-none rounded-2xl bg-gray-50 p-4 text-sm outline-none ring-2 ring-transparent focus:bg-white focus:ring-primary"
                                rows={2}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F5C518] py-4 font-display font-bold text-foreground shadow-lg shadow-yellow-500/20 active:scale-[0.98] disabled:opacity-70"
                            >
                                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save entry ✓"}
                            </button>
                            <button
                                onClick={onClose}
                                disabled={saving}
                                className="w-full py-2 text-sm font-bold text-muted-foreground hover:text-foreground"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default WeightLogModal;
