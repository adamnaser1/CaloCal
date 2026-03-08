import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { analyzePhotoWithAI } from "@/services/mealsService";

const messages = [
  "Identifying your ingredients...",
  "Calculating nutritional values...",
  "Almost done...",
];

const LoadingScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const image = (location.state as { image?: string })?.image;
  const [messagesStr, setMessagesStr] = useState(image ? "Identifying your ingredients..." : "Starting Calo Cal...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!image) return; // Don't cycle messages if just app loading

    let msgIndex = 0;
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setMessagesStr(messages[msgIndex]);
    }, 2000);

    async function analyze() {
      if (!image) return;

      const timeoutId = setTimeout(() => {
        setError("Analysis is taking longer than expected. Please try again or use manual entry.");
      }, 15000);

      try {
        setMessagesStr("Analyzing with Calo AI Vision...");
        const result = await analyzePhotoWithAI(image);
        clearTimeout(timeoutId);

        navigate('/results', {
          state: {
            analysisResult: result,
            inputMethod: 'photo',
            image: image
          },
          replace: true
        });
      } catch (err: any) {
        clearTimeout(timeoutId);
        console.error('AI Analysis failed:', err);
        setError(err.message || "Failed to analyze image");
        setTimeout(() => {
          navigate('/capture', { replace: true });
        }, 3000);
      }
    }

    analyze();
    return () => clearInterval(interval);
  }, [image, navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-8">
        <div className="mb-4 text-4xl">❌</div>
        <p className="text-center font-bold text-destructive">Analysis Failed</p>
        <p className="text-center text-sm text-muted-foreground mt-2">{error}</p>
        <p className="text-center text-xs text-muted-foreground mt-8">Returning to camera...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-8">
      {image && (
        <img
          src={image}
          alt="Meal"
          className="mb-8 h-48 w-48 rounded-3xl object-cover shadow-card"
        />
      )}

      {/* Pulsing ring */}
      <div className="relative mb-8 flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-primary animate-pulse-ring" />
        <div className="absolute h-8 w-8 rounded-full bg-primary" />
      </div>

      <div className="h-8">
        <p className="text-center text-sm font-medium text-foreground animate-pulse">
          {messagesStr}
        </p>
      </div>

      <p className="mt-10 text-xs text-muted-foreground">Powered by Calo AI Vision 🔥</p>
    </div>
  );
};

export default LoadingScreen;

