import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, X, RotateCw, Check, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Data: string, mimeType: string) => void;
}

export const CameraCaptureModal: React.FC<Props> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  // Play a quick synth shutter click sound
  const playShutterSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Audio not permitted or supported; safe to ignore
    }
  };

  // Stop current active stream
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraReady(false);
  }, []);

  // Start video stream
  const startCamera = useCallback(async () => {
    stopStream();
    setErrorMsg(null);
    setIsCameraReady(false);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera is not supported on this browser or device.');
      }

      // Check available video devices
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === 'videoinput');
        setHasMultipleCameras(videoDevices.length > 1);
      } catch {
        // Safe to ignore device enum errors
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
          setIsCameraReady(true);
        };
      }
    } catch (err: any) {
      console.warn('Could not access user media camera:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMsg('Camera permission was blocked. Please allow camera access in your browser or use the native camera button below.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMsg('No camera device was detected. You can upload a photo or use the mobile camera picker.');
      } else {
        setErrorMsg('Unable to open live camera preview. You can use your device’s native camera app below!');
      }
    }
  }, [facingMode, stopStream]);

  // Effect to manage stream lifecycle
  useEffect(() => {
    if (isOpen && !capturedPhoto) {
      startCamera();
    } else {
      stopStream();
    }
    return () => {
      stopStream();
    };
  }, [isOpen, capturedPhoto, startCamera, stopStream]);

  // Take photo from video feed
  const snapPhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    playShutterSound();
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, width, height);

    // Convert to high-quality JPEG
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedPhoto(dataUrl);
    stopStream();
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const handleConfirmPhoto = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto, 'image/jpeg');
      onClose();
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Handle native file camera input fallback
  const handleNativeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        onCapture(base64, file.type || 'image/jpeg');
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col max-h-[90vh]">
        {/* Hidden Canvas & Native Camera Input */}
        <canvas ref={canvasRef} className="hidden" />
        <input
          ref={nativeCameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleNativeFile}
        />

        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-white">
                Take Photo of Problem
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Hold your worksheet, textbook, or notebook in front of the camera
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close camera"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder Body */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[320px] sm:min-h-[420px]">
          {/* Flash Effect */}
          {isFlashing && (
            <div className="absolute inset-0 bg-white z-30 pointer-events-none animate-pulse" />
          )}

          {/* Captured Photo Preview Mode */}
          {capturedPhoto ? (
            <div className="relative w-full h-full flex items-center justify-center bg-black p-2">
              <img
                src={capturedPhoto}
                alt="Captured math problem"
                className="max-h-[65vh] max-w-full rounded-2xl object-contain shadow-lg"
              />
              <div className="absolute top-4 left-4 bg-emerald-600/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow">
                <Check className="w-3.5 h-3.5" /> Photo Snapped!
              </div>
            </div>
          ) : errorMsg ? (
            /* Error / Permission Blocked View */
            <div className="p-8 text-center max-w-md space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm sm:text-base">Camera Not Accessible</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{errorMsg}</p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => nativeCameraInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow cursor-pointer flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Open Device Camera App</span>
                </button>
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Camera</span>
                </button>
              </div>
            </div>
          ) : (
            /* Live Camera View */
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover sm:object-contain"
              />

              {/* Viewfinder Target Framing Overlay */}
              <div className="absolute inset-8 sm:inset-12 border-2 border-dashed border-white/60 rounded-3xl pointer-events-none flex flex-col justify-between p-4 shadow-2xl">
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-t-4 border-l-4 border-amber-400 rounded-tl-lg" />
                  <div className="w-6 h-6 border-t-4 border-r-4 border-amber-400 rounded-tr-lg" />
                </div>

                <div className="text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur text-[11px] sm:text-xs font-semibold text-white/90">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Center problem text inside the box
                  </span>
                </div>

                <div className="flex justify-between">
                  <div className="w-6 h-6 border-b-4 border-l-4 border-amber-400 rounded-bl-lg" />
                  <div className="w-6 h-6 border-b-4 border-r-4 border-amber-400 rounded-br-lg" />
                </div>
              </div>

              {/* Flip Camera Button (if available or mobile) */}
              <button
                type="button"
                onClick={toggleFacingMode}
                className="absolute top-4 right-4 p-2.5 rounded-2xl bg-black/50 hover:bg-black/70 text-white backdrop-blur border border-white/20 transition-all cursor-pointer"
                title="Flip between front and back camera"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {!isCameraReady && (
                <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-slate-400 font-medium">Starting camera...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
          {capturedPhoto ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retake</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmPhoto}
                className="flex-1 max-w-xs px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Use This Photo</span>
              </button>
            </>
          ) : (
            <>
              {/* Native Camera Shortcut for quick snaps */}
              <button
                type="button"
                onClick={() => nativeCameraInputRef.current?.click()}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Use phone camera app
              </button>

              {/* Shutter Button */}
              <div className="flex-1 flex justify-center">
                <button
                  type="button"
                  disabled={!isCameraReady}
                  onClick={snapPhoto}
                  className="w-16 h-16 rounded-full bg-white p-1.5 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:hover:scale-100 flex items-center justify-center border-4 border-amber-500"
                  title="Snap photo"
                >
                  <div className="w-full h-full rounded-full bg-amber-500 flex items-center justify-center text-white">
                    <Camera className="w-6 h-6" />
                  </div>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
