import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Image, Lightbulb, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";

const CaptureScreen = () => {
  const navigate = useNavigate();
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
      alert("Could not access camera. Please allow camera permission.");
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
    return () => {
      stopCamera();
    };
  }, [stream]);

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
      <div className="flex flex-1 items-center justify-center px-8 relative mt-4 mb-4">
        <div className="relative flex aspect-[4/3] w-full items-center justify-center rounded-3xl border-2 border-dashed border-muted bg-card overflow-hidden">
          {!cameraActive ? (
            <div className="flex flex-col items-center justify-center h-full p-6">
              <Camera className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-6 text-center">
                Take a photo of your meal to analyze
              </p>

              <div className="flex gap-4">
                <button
                  onClick={startCamera}
                  className="px-6 py-3 bg-[#F5C518] text-white rounded-xl font-semibold hover:bg-yellow-500 transition-colors shadow"
                >
                  📸 Open Camera
                </button>

                <label className="px-6 py-3 bg-muted text-foreground rounded-xl font-semibold hover:bg-muted/80 transition-colors cursor-pointer shadow">
                  📁 Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="hidden"
                  />
                </label>
              </div>
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

              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-10">
                <button
                  onClick={stopCamera}
                  className="px-6 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-colors shadow"
                >
                  ✕ Cancel
                </button>

                <button
                  onClick={capturePhoto}
                  className="w-16 h-16 bg-white rounded-full border-4 border-[#F5C518] hover:scale-110 transition-transform shadow-lg"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {!cameraActive && (
        <>
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
              onClick={() => navigate('/scan')}
              className="flex flex-col items-center gap-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card/10">
                <span className="text-xl">📊</span>
              </div>
              <span className="text-xs text-muted">Scan</span>
            </button>

            <button
              onClick={startCamera}
              className="flex h-18 w-18 items-center justify-center rounded-full border-4 border-primary bg-primary cursor-pointer hover:scale-105 transition-transform"
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
        </>
      )}

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
