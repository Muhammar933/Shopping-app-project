import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Camera,
  Upload,
  User,
  Check,
  RotateCcw,
  ShoppingBag,
  Share2,
  Bookmark,
  Info,
  SlidersHorizontal,
  X,
  AlertCircle,
} from 'lucide-react';
import { Product } from '../../types';
import { PRESET_MODELS } from '../../data/mockData';

interface TryOnScreenProps {
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL', colorName: string) => void;
  onSaveLook: (product: Product, imageUrl: string) => void;
}

export const TryOnScreen: React.FC<TryOnScreenProps> = ({
  products,
  selectedProduct,
  onSelectProduct,
  onAddToCart,
  onSaveLook,
}) => {
  const currentProduct = selectedProduct || products[0];

  const [inputMode, setInputMode] = useState<'preset' | 'upload' | 'camera'>('preset');
  const [selectedPreset, setSelectedPreset] = useState<string>(PRESET_MODELS[0].id);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>('');
  const [resultLook, setResultLook] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [savedBadge, setSavedBadge] = useState(false);
  const [cameraNotice, setCameraNotice] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera stream safely
  const stopCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // Active user image being fitted
  const activeUserImage =
    customPhotoUrl ||
    PRESET_MODELS.find((m) => m.id === selectedPreset)?.image ||
    PRESET_MODELS[0].image;

  // Handler for silhouette thumbnail selection (single tap / click)
  const handleThumbnailClick = (presetId: string) => {
    stopCameraStream();
    setSelectedPreset(presetId);
    setCustomPhotoUrl(null);
    setResultLook(null);
  };

  // Handler for clothing thumbnail selection (single tap / click)
  // Strictly updates persistent product selection; no release events reset this state
  const handleProductThumbnailClick = (product: Product) => {
    onSelectProduct(product);
    setResultLook(null);
  };

  // Start webcam
  const startCamera = async () => {
    setCameraNotice(null);
    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraNotice('Camera is not supported in this browser or environment.');
      setInputMode('preset');
      return;
    }

    setInputMode('camera');
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 960 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch {
      setCameraNotice('Camera permission was denied or unavailable. Switched to preset model.');
      setInputMode('preset');
      setIsCameraActive(false);
      setTimeout(() => setCameraNotice(null), 5000);
    }
  };

  // Capture webcam snapshot
  const captureCameraSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 720;
    canvas.height = videoRef.current.videoHeight || 960;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCustomPhotoUrl(dataUrl);
      if (resultLook) {
        setResultLook(dataUrl);
      }
    }
    stopCameraStream();
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    stopCameraStream();
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCustomPhotoUrl(dataUrl);
      setInputMode('upload');
      if (resultLook) {
        setResultLook(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Execute Virtual Try-On Pipeline
  const handleGenerateLook = async () => {
    if (!currentProduct) return;
    setIsProcessing(true);
    setResultLook(null);

    // Step 1: Torso detection
    setProcessStep('Detecting torso keypoints & shoulder posture...');
    await new Promise((r) => setTimeout(r, 600));

    // Step 2: Mesh alignment & drape
    setProcessStep(`Draping ${currentProduct.name} fabric structure...`);
    await new Promise((r) => setTimeout(r, 700));

    // Step 3: Neural light balancing
    setProcessStep('Balancing ambient reflections & crease physics...');
    await new Promise((r) => setTimeout(r, 600));

    // Result: Render photorealistic look
    const chosenResult =
      selectedPreset === PRESET_MODELS[0].id && !customPhotoUrl
        ? currentProduct.tryOnModelImage || activeUserImage
        : activeUserImage;
    setResultLook(chosenResult);
    setIsProcessing(false);
  };

  const handleQuickAdd = () => {
    if (!currentProduct) return;
    const variant = currentProduct.variants[0];
    onAddToCart(currentProduct, variant.size, variant.colorName);
  };

  const handleSave = () => {
    if (!currentProduct || !resultLook) return;
    onSaveLook(currentProduct, resultLook);
    setSavedBadge(true);
    setTimeout(() => setSavedBadge(false), 2000);
  };

  // Persistent selected try-on image (person wearing the selected T-shirt):
  const selectedFittingImage =
    (selectedPreset === PRESET_MODELS[0].id && !customPhotoUrl
      ? currentProduct.tryOnModelImage
      : null) ||
    currentProduct.tryOnModelImage ||
    activeUserImage;

  // Active preview image: if holding compare, show original garment; otherwise show fitted look
  const currentPreviewImage = showOriginal
    ? currentProduct.images[0]
    : (resultLook || selectedFittingImage);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-5 py-3 z-30 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-extrabold tracking-widest uppercase text-neutral-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#D4A373]" />
            AI Virtual Fitting Room
          </h1>
          <p className="text-[10px] text-neutral-500 font-medium">
            Neural garment alignment & drape preview
          </p>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Main Canvas / Result Display */}
        <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-sm flex items-center justify-center">
          {/* Live Camera View */}
          {isCameraActive ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Overlay guidelines */}
              <div className="absolute inset-0 border-2 border-dashed border-white/50 m-8 rounded-xl pointer-events-none flex flex-col items-center justify-between p-4">
                <span className="text-[10px] font-bold text-white/90 bg-black/60 px-2 py-0.5 rounded">
                  Align upper body inside frame
                </span>
                <span className="text-[10px] font-medium text-white/70 bg-black/60 px-2 py-0.5 rounded">
                  Keep shoulders visible
                </span>
              </div>
              <button
                onClick={captureCameraSnapshot}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-white border-4 border-neutral-900 flex items-center justify-center shadow-lg"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-900" />
              </button>
            </div>
          ) : isProcessing ? (
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-2 border-neutral-700 border-t-[#D4A373] animate-spin" />
                <Sparkles className="w-6 h-6 text-[#D4A373] absolute inset-0 m-auto" />
              </div>
              <div>
                <p className="text-xs font-bold text-white tracking-wider uppercase">
                  Rendering Neural Fit
                </p>
                <p className="text-[11px] text-neutral-400 mt-1 max-w-[240px] leading-relaxed">
                  {processStep}
                </p>
              </div>
            </div>
          ) : (
            /* Try-On Look Result / Active Preview */
            <div className="relative w-full h-full">
              <img
                src={currentPreviewImage}
                alt="Virtual Try-On Preview"
                className="w-full h-full object-cover transition-opacity duration-200"
              />

              {/* Look Generated Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[#D4A373] text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {showOriginal
                  ? 'Original Garment'
                  : resultLook
                  ? 'Fitted by Threadly AI'
                  : `Preview: ${currentProduct.name}`}
              </div>

              {/* Hold to compare button - independent temporary state */}
              <button
                type="button"
                onMouseDown={() => setShowOriginal(true)}
                onMouseUp={() => setShowOriginal(false)}
                onTouchStart={() => setShowOriginal(true)}
                onTouchEnd={() => setShowOriginal(false)}
                onPointerDown={() => setShowOriginal(true)}
                onPointerUp={() => setShowOriginal(false)}
                onPointerLeave={() => setShowOriginal(false)}
                className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-md text-neutral-900 text-[10px] font-bold tracking-wider uppercase shadow-sm select-none touch-none hover:bg-white"
              >
                {showOriginal ? 'Comparing' : 'Hold to Compare'}
              </button>

              {/* Bottom Result Action Bar */}
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-center gap-2">
                <button
                  onClick={handleQuickAdd}
                  className="flex-1 py-2.5 bg-white text-neutral-900 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-sm hover:bg-neutral-100 uppercase tracking-wide"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Add To Bag
                </button>
                <button
                  onClick={handleSave}
                  className="p-2.5 bg-neutral-800/80 backdrop-blur-md text-white rounded-lg hover:bg-neutral-800"
                  title="Save Look"
                >
                  <Bookmark className={`w-4 h-4 ${savedBadge ? 'fill-white' : ''}`} />
                </button>
                <button
                  onClick={handleGenerateLook}
                  className="p-2.5 bg-neutral-800/80 backdrop-blur-md text-white rounded-lg hover:bg-neutral-800"
                  title="Regenerate Look"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Input Source Selector */}
        <div className="bg-white rounded-xl p-3 border border-neutral-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              1. Fitting Silhouette
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setInputMode('preset')}
                className={`px-2 py-1 rounded text-[11px] font-semibold ${
                  inputMode === 'preset' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'
                }`}
              >
                Presets
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 ${
                  inputMode === 'upload' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'
                }`}
              >
                <Upload className="w-3 h-3" />
                Upload
              </button>
              <button
                onClick={startCamera}
                className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 ${
                  inputMode === 'camera' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'
                }`}
              >
                <Camera className="w-3 h-3" />
                Live Camera
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* Preset Model Avatars Carousel */}
          {inputMode === 'preset' && (
            <div className="grid grid-cols-4 gap-2 pt-1 try-on-thumbnail-container" data-testid="try-on-thumbnail-container-models">
              {PRESET_MODELS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleThumbnailClick(m.id)}
                  className={`relative rounded-lg overflow-hidden aspect-[3/4] border-2 transition-all ${
                    selectedPreset === m.id && !customPhotoUrl
                      ? 'border-neutral-900 ring-2 ring-neutral-900/20'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={m.image} alt={m.label} className="w-full h-full object-cover" />
                  {selectedPreset === m.id && !customPhotoUrl && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Fitting Tips Accordion */}
          <div className="flex items-start gap-2 bg-[#F9F9F7] p-2.5 rounded-lg text-[11px] text-neutral-600">
            <Info className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" />
            <span>
              Best results: Stand straight facing the camera with good natural light and your upper body unobstructed.
            </span>
          </div>
        </div>

        {/* Garment Selector */}
        <div className="bg-white rounded-xl p-3 border border-neutral-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              2. Selected T-Shirt
            </span>
            <span className="text-[11px] font-bold text-neutral-900">
              ${currentProduct.price.toFixed(2)}
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 try-on-thumbnail-container" data-testid="try-on-thumbnail-container-garments">
            {products.map((p) => {
              const isSelected = p.id === currentProduct.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleProductThumbnailClick(p)}
                  className={`w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer transition-all text-left ${
                    isSelected
                      ? 'border-neutral-900 ring-2 ring-neutral-900/20'
                      : 'border-neutral-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="aspect-square bg-neutral-100 relative">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                  <div className="p-1 bg-white">
                    <p className="text-[10px] font-semibold text-neutral-900 truncate">
                      {p.name}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA to Trigger Neural Generation */}
        <button
          onClick={handleGenerateLook}
          disabled={isProcessing}
          className="w-full py-3.5 px-4 bg-neutral-900 text-white font-extrabold text-xs tracking-widest rounded-xl uppercase flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-sm disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-[#D4A373]" />
          {isProcessing ? 'PROCESSING FIT...' : 'GENERATE TRY-ON LOOK'}
        </button>
      </div>
    </div>
  );
};
