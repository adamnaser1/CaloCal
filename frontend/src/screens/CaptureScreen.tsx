import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Image, Lightbulb, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import { useLanguage } from "@/contexts/LanguageContext";

const CaptureScreen = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const fileRef = useRef<HTMLInputElement>(null);
  const [showTip, setShowTip] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      setStream(mediaStream);
      setCameraActive(true);
    } catch (error) {
      console.error('Camera access denied:', error);
      alert(t('camera.denied') || "Could not access camera. Please allow camera permission.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraActive(false);
    }
  };

  useEffect(() => {
    if (cameraActive && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [cameraActive, stream]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const handleFile = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      navigate("/loading", { state: { image: reader.result as string } });
    };
    reader.readAsDataURL(file);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
          handleFile({ target: { files: [file] } });
          stopCamera();
        }
      }, 'image/jpeg', 0.95);
    }
  };

  return (
    <div className={`flex min-h-screen flex-col bg-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {/* Top bar */}
      <header className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={() => navigate(-1)} className="text-white p-2 -ml-2">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-display font-black text-white">{t('capture.title') || "Snap your meal"}</h1>
      </header>

      {/* Viewfinder */}
      <div className="flex flex-1 items-center justify-center px-8 relative mt-4 mb-4">
        <div className="relative flex aspect-[4/3] w-full items-center justify-center rounded-[2.5rem] border-2 border-dashed border-white/20 bg-white/5 overflow-hidden shadow-2xl">
          {!cameraActive ? (
            <div className="flex flex-col items-center justify-center h-full p-6">
              <Camera className="w-16 h-16 text-white/20 mb-4 animate-pulse" />
              <p className="text-white/40 font-medium text-center">
                {t('capture.startingCamera') || "Starting camera..."}
              </p>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              {/* Corner Decorations */}
              <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
              <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
              <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
              <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-8 py-8 bg-black/20 backdrop-blur-sm">
        <button
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 group-hover:bg-white/20 transition-colors">
            <Image className="h-6 w-6 text-white" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">{t('capture.gallery') || "Gallery"}</span>
        </button>

        <button
          onClick={() => navigate('/scan')}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 group-hover:bg-white/20 transition-colors">
            <span className="text-2xl">📊</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">{t('capture.scan') || "Scan"}</span>
        </button>

        <button
          onClick={cameraActive ? capturePhoto : startCamera}
          className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/20 bg-primary p-1 shadow-2xl active:scale-90 transition-all group"
        >
          <div className="h-full w-full rounded-full border-4 border-black/10 group-hover:border-black/20 transition-all" />
        </button>

        <button
          onClick={() => navigate('/voice')}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 group-hover:bg-white/20 transition-colors">
            <span className="text-2xl">🎤</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">{t('capture.voice') || "Voice"}</span>
        </button>
      </div>

      <p className="pb-10 text-center text-xs font-medium text-white/40 px-8 leading-relaxed">
        {t('capture.hint') || "The clearer the photo, the better the analysis"}
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
