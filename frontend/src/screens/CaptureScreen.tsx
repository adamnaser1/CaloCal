import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Image, Lightbulb, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  useEffect(() => {
    // Hide bottom navigation when component mounts
    const bottomNav = document.querySelector('[role="navigation"]');
    if (bottomNav) {
      (bottomNav as HTMLElement).style.display = 'none';
    }
    
    // Show it again when component unmounts
    return () => {
      const bottomNav = document.querySelector('[role="navigation"]');
      if (bottomNav) {
        (bottomNav as HTMLElement).style.display = 'flex';
      }
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
    <div className={`relative w-full flex flex-col items-center justify-center min-h-screen bg-black pb-0 ${language === 'ar' ? 'font-arabic' : ''}`}>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {/* Top bar */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center gap-3 px-5 pt-8 pb-4 bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={() => navigate(-1)} className="text-white p-2 -ml-2">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-display font-black text-white">{t('capture.title') || "Snap your meal"}</h1>
      </header>

      {/* Camera preview */}
      <div className="relative w-full max-w-lg aspect-square mt-[-10vh]">
        {!cameraActive ? (
          <div className="flex flex-col items-center justify-center h-full p-6 bg-white/5 border-4 border-yellow-400">
            <Camera className="w-16 h-16 text-yellow-400 mb-4 animate-pulse" />
            <p className="text-white/80 font-medium text-center">
              {t('capture.startingCamera') || "Starting camera..."}
            </p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-none"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Camera frame overlay */}
            <div className="absolute inset-0 border-4 border-yellow-400 pointer-events-none" />
          </>
        )}
      </div>

      {/* Capture controls - positioned at bottom */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-6 px-6">
        <button
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center gap-2 group cursor-pointer"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 group-hover:bg-white/20 transition-colors">
            <Image className="h-5 w-5 text-white" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">{t('capture.gallery') || "Gallery"}</span>
        </button>

        <button
          onClick={() => navigate('/scan')}
          className="flex flex-col items-center gap-2 group cursor-pointer"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 group-hover:bg-white/20 transition-colors">
            <span className="text-xl">📊</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">{t('capture.scan') || "Scan"}</span>
        </button>

        <button
          onClick={cameraActive ? capturePhoto : startCamera}
          className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-yellow-400 bg-black p-1 shadow-2xl active:scale-90 transition-all group shrink-0 cursor-pointer"
        >
          <div className="h-full w-full rounded-full border-[6px] border-yellow-400 group-hover:bg-yellow-400/20 transition-all" />
        </button>

        <button
          onClick={() => navigate('/voice')}
          className="flex flex-col items-center gap-2 group cursor-pointer"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 group-hover:bg-white/20 transition-colors">
            <span className="text-xl">🎤</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">{t('capture.voice') || "Voice"}</span>
        </button>
      </div>

      {/* Tip bottom sheet */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-card p-6 border-t border-border shadow-2xl"
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
    </div>
  );
};

export default CaptureScreen;
