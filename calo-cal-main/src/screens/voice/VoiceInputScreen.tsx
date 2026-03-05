import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mic, Square, Check, X, Loader2, AlertTriangle, Keyboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { VoiceRecorder } from "@/services/voiceService";
// import { analyseTextMeal } from "@/services/mealsService"; // Not used anymore
import { useToast } from "@/hooks/use-toast";

// Types
type VoiceState = 'idle' | 'recording' | 'processing' | 'done' | 'error';
type Language = 'fr-FR' | 'ar-TN' | 'en-US';

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
    { code: 'fr-FR', label: 'FR', flag: '🇫🇷' },
    { code: 'ar-TN', label: 'TN', flag: '🇹🇳' },
    { code: 'en-US', label: 'EN', flag: '🇬🇧' }
];

const VoiceInputScreen = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [state, setState] = useState<VoiceState>('idle');
    const [transcript, setTranscript] = useState("");
    const [elapsed, setElapsed] = useState(0);
    const [currentLang, setCurrentLang] = useState<Language>('fr-FR');
    const [isSupported, setIsSupported] = useState(true);

    const recorderRef = useRef<VoiceRecorder>(new VoiceRecorder());
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Check support on mount
        if (!recorderRef.current.isSupported()) {
            setIsSupported(false);
            setState('error'); // or handled via UI check
        }
    }, []);

    useEffect(() => {
        // Timer logic
        if (state === 'recording') {
            timerRef.current = setInterval(() => {
                setElapsed(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            setElapsed(0);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        }
    }, [state]);

    const handleStartRecording = () => {
        setTranscript("");
        setState('recording');
        recorderRef.current.setLanguage(currentLang);

        recorderRef.current.start(
            (text, isFinal) => {
                setTranscript(text);
            },
            (finalText) => {
                // This is called when recognition stops automatically or manually
                // But if we stop manually, we might set state to processing first
                if (state === 'recording') {
                    // automatic stop (silence)
                    handleStopRecording();
                }
            },
            (error) => {
                console.error("Voice error:", error);
                setState('error');
            }
        );
    };

    const handleStopRecording = () => {
        recorderRef.current.stop();
        setState('processing');

        // Simulate processing delay
        setTimeout(() => {
            setState('done');
        }, 1500);
    };

    const handleCleanup = () => {
        setTranscript("");
        setState('idle');
    };

    const handleAnalyse = async () => {
        // Pass transcript to results screen via router state
        // We can do analysis here or just pass text. 
        // Plan said: "After analysis -> navigate to ResultsScreen passing result"
        // AND "Call existing AI analysis logic... in services/mealsService.ts"
        // So we should call it here.

        setState('processing'); // Show loading again? Or keep 'done' but with loader?
        // Let's us 'processing' state again or local loading.

        try {
            // const result = await analyseTextMeal(transcript);
            // toast({
            //     title: "Meal analysed! Check your results.",
            //     duration: 3000,
            // });
            // navigate('/results', {
            //     state: {
            //         analysisResult: result,
            //         inputMethod: 'voice',
            //         transcript: transcript
            //     }
            // });

            toast({
                title: "Voice input currently disabled",
                description: "Text analysis has been replaced with image recognition.",
                duration: 3000,
            });
            setState('idle');
        } catch (e) {
            console.error(e);
            setState('error');
            toast({
                variant: "destructive",
                title: "Something went wrong.",
                description: "Please try again.",
                duration: 5000,
            });
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Unsupported UI
    if (!isSupported) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
                <div className="mb-6 rounded-full bg-yellow-100 p-6">
                    <AlertTriangle className="h-10 w-10 text-yellow-600" />
                </div>
                <h2 className="mb-2 font-display text-xl font-bold">Voice not supported</h2>
                <p className="mb-8 text-muted-foreground">
                    Your browser doesn't support voice input. Please try Chrome or Safari.
                </p>
                <button
                    onClick={() => navigate('/diary')}
                    className="w-full rounded-2xl bg-[#F5C518] py-4 font-bold text-foreground"
                >
                    Type manually instead
                </button>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-background transition-colors duration-500">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-6">
                <button onClick={() => navigate(-1)} className="rounded-full bg-secondary p-2">
                    <ArrowLeft className="h-6 w-6 text-foreground" />
                </button>
                {state === 'recording' && (
                    <div className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600 font-mono">
                        {formatTime(elapsed)}
                    </div>
                )}
                <div className="w-10" /> {/* spacer */}
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col items-center justify-center px-6">

                {/* Transcript Bubble */}
                <AnimatePresence mode="wait">
                    {(state === 'recording' || state === 'processing' || state === 'done') && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mb-12 w-full max-w-sm rounded-3xl bg-secondary/50 p-6 backdrop-blur-sm"
                        >
                            <p className="text-center font-display text-lg font-medium leading-relaxed text-foreground">
                                "{transcript || "Listening..."}"
                            </p>
                        </motion.div>
                    )}
                    {state === 'error' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-12 w-full max-w-sm rounded-3xl bg-red-50 p-6"
                        >
                            <p className="text-center font-display text-lg font-medium text-red-600">
                                Could not understand. Please try again.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Visualizer / Mic Area */}
                <div className="relative mb-12 flex items-center justify-center">
                    {/* Rings */}
                    {state === 'recording' && (
                        <>
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute h-64 w-64 rounded-full bg-[#F5C518]/20"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                                className="absolute h-48 w-48 rounded-full bg-[#F5C518]/30"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], opacity: [0.8, 0.2, 0.8] }}
                                transition={{ repeat: Infinity, duration: 1, delay: 0.1 }}
                                className="absolute h-32 w-32 rounded-full bg-[#F5C518]/40"
                            />
                        </>
                    )}

                    {state === 'processing' && (
                        <div className="absolute h-40 w-40 rounded-full bg-[#F5C518]/20" />
                    )}

                    {/* Center Button */}
                    <motion.div
                        layout
                        className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-full shadow-lg transition-colors duration-300 ${state === 'recording' ? 'bg-[#F5C518]' :
                            state === 'error' ? 'bg-red-500' :
                                state === 'done' ? 'bg-green-500' :
                                    state === 'processing' ? 'bg-white border-4 border-[#F5C518]' :
                                        'bg-white border-2 border-secondary'
                            }`}
                        animate={state === 'recording' ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                        onClick={() => {
                            if (state === 'idle') handleStartRecording();
                        }}
                    >
                        {state === 'idle' && <Mic className="h-8 w-8 text-foreground" />}
                        {state === 'recording' && <Mic className="h-8 w-8 text-foreground" />}
                        {state === 'processing' && <Loader2 className="h-8 w-8 animate-spin text-[#F5C518]" />}
                        {state === 'done' && <Check className="h-10 w-10 text-white" />}
                        {state === 'error' && <X className="h-10 w-10 text-white" />}
                    </motion.div>
                </div>

                {/* Text Status */}
                <div className="mb-8 min-h-[24px] text-center">
                    {state === 'idle' && <p className="text-muted-foreground">Tap the mic to start</p>}
                    {state === 'recording' && <p className="animate-pulse font-medium text-[#F5C518]">Listening...</p>}
                    {state === 'processing' && <p className="text-muted-foreground">Analysing your meal...</p>}
                    {/* Done/Error states handle text in buttons or specific areas */}
                </div>

                {/* Language Selector (only idle) */}
                {state === 'idle' && (
                    <div className="flex gap-2 rounded-full bg-secondary/50 p-1">
                        {LANGUAGES.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => setCurrentLang(lang.code)}
                                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${currentLang === lang.code
                                    ? 'bg-[#F5C518] text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:bg-white/50'
                                    }`}
                            >
                                <span className="mr-1">{lang.flag}</span>
                                {lang.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="fixed bottom-12 left-0 w-full px-6">
                    <AnimatePresence mode="wait">
                        {state === 'idle' && (
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full rounded-2xl bg-[#F5C518] py-4 font-display font-bold text-foreground shadow-lg shadow-yellow-500/20 active:scale-[0.98]"
                                onClick={handleStartRecording}
                            >
                                Start recording
                            </motion.button>
                        )}

                        {state === 'recording' && (
                            <div className="flex flex-col gap-4">
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="w-full rounded-2xl bg-red-500 py-4 font-bold text-white shadow-lg shadow-red-500/20 active:scale-[0.98]"
                                    onClick={handleStopRecording}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Square className="h-4 w-4 fill-current" />
                                        Stop recording
                                    </div>
                                </motion.button>

                                <button
                                    onClick={() => navigate('/diary')} // Or capture? 'Type instead' usually goes to text input or manual add
                                    className="flex w-full items-center justify-center gap-2 text-sm font-medium text-muted-foreground"
                                >
                                    <Keyboard className="h-4 w-4" />
                                    Type instead
                                </button>
                            </div>
                        )}

                        {state === 'done' && (
                            <div className="flex flex-col gap-3">
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="w-full rounded-2xl bg-[#F5C518] py-4 font-display font-bold text-foreground shadow-lg shadow-yellow-500/20 active:scale-[0.98]"
                                    onClick={handleAnalyse}
                                >
                                    Analyse this meal →
                                </motion.button>
                                <button
                                    onClick={handleCleanup}
                                    className="w-full py-4 text-sm font-bold text-muted-foreground hover:text-foreground"
                                >
                                    Re-record
                                </button>
                            </div>
                        )}

                        {state === 'error' && (
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full rounded-2xl bg-[#F5C518] py-4 font-display font-bold text-foreground active:scale-[0.98]"
                                onClick={handleCleanup}
                            >
                                Try again
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
};

export default VoiceInputScreen;
