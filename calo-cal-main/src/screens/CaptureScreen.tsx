import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Image, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";

const CaptureScreen = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [showTip, setShowTip] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      navigate("/loading", { state: { image: reader.result as string } });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex min-h-screen flex-col bg-foreground">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {/* Top bar */}
      <header className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={() => navigate(-1)} className="text-background">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-display font-bold text-background">Snap your meal</h1>
      </header>

      {/* Viewfinder */}
      <div className="flex flex-1 items-center justify-center px-8">
        <div className="relative flex aspect-[4/3] w-full items-center justify-center rounded-3xl border-2 border-dashed border-muted">
          <span className="text-sm text-muted">Place your meal here</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-8 py-6">
        <button
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center gap-1"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card/10">
            <Image className="h-5 w-5 text-background" />
          </div>
          <span className="text-xs text-muted">Gallery</span>
        </button>

        <button
          onClick={() => fileRef.current?.click()}
          className="flex h-18 w-18 items-center justify-center rounded-full border-4 border-primary bg-primary"
          style={{ width: 72, height: 72 }}
        >
          <div className="h-14 w-14 rounded-full bg-primary border-2 border-primary-foreground" style={{ width: 56, height: 56 }} />
        </button>

        <button
          onClick={() => navigate('/scan')}
          className="flex flex-col items-center gap-1"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card/10">
            <span className="text-xl">📊</span>
          </div>
          <span className="text-xs text-muted">Scan</span>
        </button>

        <button
          onClick={() => fileRef.current?.click()}
          className="flex h-18 w-18 items-center justify-center rounded-full border-4 border-primary bg-primary"
          style={{ width: 72, height: 72 }}
        >
          <div className="h-14 w-14 rounded-full bg-primary border-2 border-primary-foreground" style={{ width: 56, height: 56 }} />
        </button>

        <button
          onClick={() => navigate('/voice')}
          className="flex flex-col items-center gap-1"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card/10">
            <span className="text-xl">🎤</span>
          </div>
          <span className="text-xs text-muted">Voice</span>
        </button>
      </div>

      <p className="pb-8 text-center text-xs text-muted">
        The clearer the photo, the better the analysis
      </p>

      {/* Tip bottom sheet */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-card p-6"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
            <h3 className="mb-2 font-display font-bold text-foreground">💡 Photo tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Good lighting = better results!</li>
              <li>• Place the dish on a plain surface</li>
              <li>• Capture the full plate from above</li>
            </ul>
            <button
              onClick={() => setShowTip(false)}
              className="mt-5 w-full rounded-2xl bg-primary py-3 font-semibold text-primary-foreground"
            >
              Got it
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default CaptureScreen;
