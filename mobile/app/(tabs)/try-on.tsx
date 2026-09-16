import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  Camera,
  Image as ImageIcon,
  Sparkles,
  Check,
  RefreshCw,
  ShoppingBag,
  Eye,
  Info,
  User,
} from 'lucide-react-native';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { useTryOnStore } from '../../store/useTryOnStore';
import { useCartStore } from '../../store/useCartStore';
import { Button } from '../../components/Button';
import { theme } from '../../constants/theme';

export const PRESET_MODELS = [
  {
    id: 'model-1',
    label: 'Studio Male',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
    description: 'Athletic • Size L',
  },
  {
    id: 'model-2',
    label: 'Studio Female',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
    description: 'Relaxed • Size M',
  },
  {
    id: 'model-3',
    label: 'Urban Minimalist',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    description: 'Standard • Size M',
  },
  {
    id: 'model-4',
    label: 'Streetwear Natural',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80',
    description: 'Casual • Size S',
  },
];

// ==========================================
// 1. REFACTORED GARMENT THUMBNAIL COMPONENT
// ==========================================
interface GarmentThumbnailProps {
  product: Product;
  isSelected: boolean;
  onSelect: (product: Product) => void;
}

export const GarmentThumbnail: React.FC<GarmentThumbnailProps> = ({
  product,
  isSelected,
  onSelect,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.garmentCard,
        isSelected && styles.garmentCardActive,
        pressed && styles.cardPressed,
      ]}
      onPress={() => onSelect(product)}
      accessibilityRole="button"
      accessibilityLabel={`Select garment ${product.name}`}
    >
      <View style={styles.thumbnailWrapper}>
        <Image source={{ uri: product.images[0] }} style={styles.garmentImage} />

        {/* Selected Checkmark Badge */}
        {isSelected && (
          <View style={styles.checkBadge}>
            <Check size={11} color="#FFFFFF" strokeWidth={2.5} />
          </View>
        )}
      </View>

      <Text style={styles.garmentName} numberOfLines={1}>
        {product.name}
      </Text>
      <Text style={styles.garmentPrice}>${product.price.toFixed(2)}</Text>
    </Pressable>
  );
};

// ==========================================
// 2. REFACTORED SILHOUETTE THUMBNAIL COMPONENT
// ==========================================
interface SilhouetteThumbnailProps {
  model: (typeof PRESET_MODELS)[0];
  isSelected: boolean;
  onSelect: (modelId: string) => void;
}

export const SilhouetteThumbnail: React.FC<SilhouetteThumbnailProps> = ({
  model,
  isSelected,
  onSelect,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.modelCard,
        isSelected && styles.modelCardActive,
        pressed && styles.cardPressed,
      ]}
      onPress={() => onSelect(model.id)}
      accessibilityRole="button"
      accessibilityLabel={`Select model silhouette ${model.label}`}
    >
      <View style={styles.thumbnailWrapper}>
        <Image source={{ uri: model.image }} style={styles.modelImage} />

        {isSelected && (
          <View style={styles.checkBadge}>
            <Check size={11} color="#FFFFFF" strokeWidth={2.5} />
          </View>
        )}
      </View>

      <Text style={styles.modelName} numberOfLines={1}>
        {model.label}
      </Text>
    </Pressable>
  );
};

// ==========================================
// 3. MAIN TRY-ON SCREEN
// ==========================================
export default function TryOnScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string>(PRESET_MODELS[0].id);
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);

  // Active preview mode when no AI result has been generated yet:
  // Shows either the chosen silhouette or the chosen garment
  const [activePreviewMode, setActivePreviewMode] = useState<'silhouette' | 'garment'>('silhouette');

  // Independent Compare State: holds a comparison image URL without mutating primary selection
  const [comparingImageUrl, setComparingImageUrl] = useState<string | null>(null);
  const isComparing = comparingImageUrl !== null;

  const { startTryOn, pollSession } = useTryOnStore();
  const addItemToCart = useCartStore((s) => s.addItem);

  useEffect(() => {
    productService.getProducts().then((list) => {
      setProducts(list);
      if (params.productId) {
        const matching = list.find((p) => p.id === params.productId);
        if (matching) setSelectedProduct(matching);
      } else if (list.length > 0) {
        setSelectedProduct(list[0]);
      }
    });
  }, [params.productId]);

  // Current active silhouette/photo
  const activeSilhouetteImage =
    capturedPhotoUri ||
    PRESET_MODELS.find((m) => m.id === selectedModelId)?.image ||
    PRESET_MODELS[0].image;

  // Selected garment image
  const activeGarmentImage = selectedProduct?.images[0] || null;

  // PRIMARY STATE SETTER: Select Product (single tap onPress)
  // Updates state persistently without reset on touch release
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActivePreviewMode('garment');
    // If a result look is currently active, update preview to the newly selected garment
    if (resultImageUrl) {
      setResultImageUrl(product.images[0]);
    }
  };

  // PRIMARY STATE SETTER: Select Silhouette Model (single tap onPress)
  // Updates state persistently without reset on touch release
  const handleSelectModel = (modelId: string) => {
    setSelectedModelId(modelId);
    setCapturedPhotoUri(null);
    setActivePreviewMode('silhouette');
    const model = PRESET_MODELS.find((m) => m.id === modelId);
    if (model && resultImageUrl) {
      setResultImageUrl(model.image);
    }
  };

  // SEPARATE COMPARE EVENT HANDLERS:
  // Isolated purely to temporary compare overlay; does NOT alter selectedProduct or selectedModelId
  const handleCompareStart = (imageUrl: string) => {
    setComparingImageUrl(imageUrl);
  };

  const handleCompareEnd = () => {
    setComparingImageUrl(null);
  };

  const handlePickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.85,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setCapturedPhotoUri(result.assets[0].uri);
      setActivePreviewMode('silhouette');
      if (resultImageUrl) {
        setResultImageUrl(result.assets[0].uri);
      }
    }
  };

  const handleLaunchCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission Denied', 'Threadly requires camera access to capture your try-on photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.85,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setCapturedPhotoUri(result.assets[0].uri);
      setActivePreviewMode('silhouette');
      if (resultImageUrl) {
        setResultImageUrl(result.assets[0].uri);
      }
    }
  };

  const handleGenerateLook = async () => {
    if (!selectedProduct) return;

    setIsProcessing(true);
    try {
      const inputImage = capturedPhotoUri || activeSilhouetteImage;
      const session = await startTryOn(selectedProduct.id, inputImage);

      let status = session.status;
      let attempts = 0;
      while (status !== 'COMPLETED' && attempts < 8) {
        await new Promise((r) => setTimeout(r, 1000));
        const updated = await pollSession(session.id);
        status = updated.status;
        attempts++;
        if (status === 'COMPLETED' && updated.result?.resultImage) {
          setResultImageUrl(updated.result.resultImage);
          break;
        }
      }

      if (!resultImageUrl) {
        setResultImageUrl(selectedProduct.images[0]);
      }
    } catch {
      setResultImageUrl(selectedProduct.images[0]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedProduct || !selectedProduct.variants[0]) return;
    try {
      await addItemToCart(selectedProduct.id, selectedProduct.variants[0].id, 1);
      Alert.alert('Added to Cart', `${selectedProduct.name} has been placed in your bag.`);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not add item to bag.');
    }
  };

  // Baseline displayed image:
  // Persistent preview based on active selection (never reset by touch release)
  // Shows model wearing the garment if available, or garment image / silhouette
  const selectedFittingImage =
    selectedProduct?.tryOnModelImage ||
    activeGarmentImage ||
    activeSilhouetteImage;

  const baselineDisplayedImage = resultImageUrl
    ? resultImageUrl
    : selectedFittingImage;

  // Final displayed image: if comparing, temporarily override with comparingImageUrl;
  // when compare ends (touch release), safely reverts to baselineDisplayedImage without state reset!
  const currentDisplayedImage = isComparing
    ? (comparingImageUrl || selectedProduct?.images[0] || activeSilhouetteImage)
    : baselineDisplayedImage;

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>VIRTUAL TRY-ON</Text>
          <Text style={styles.subtitle}>AI-Powered Precision Fitting</Text>
        </View>
        <Sparkles size={22} color="#D4A373" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Display / Preview Card */}
        {isProcessing ? (
          <View style={styles.processingCard}>
            <ActivityIndicator size="large" color="#111111" />
            <Text style={styles.processingTitle}>CREATING YOUR LOOK...</Text>
            <Text style={styles.processingSubtitle}>
              Aligning posture, draping {selectedProduct?.name} fabric, and balancing lighting.
            </Text>
          </View>
        ) : (
          <View style={styles.resultContainer}>
            {/* Status / Compare Badge */}
            <View style={[styles.resultBadge, isComparing && styles.resultBadgeComparing]}>
              <Sparkles size={14} color={isComparing ? '#111111' : '#D4A373'} />
              <Text
                style={[
                  styles.resultBadgeText,
                  isComparing && styles.resultBadgeTextComparing,
                ]}
              >
                {isComparing
                  ? 'COMPARING: ORIGINAL VIEW'
                  : resultImageUrl
                  ? 'LOOK GENERATED BY THREADLY AI'
                  : selectedProduct
                  ? `PREVIEW: ${selectedProduct.name}`
                  : 'READY TO FIT SILHOUETTE'}
              </Text>
            </View>

            {/* Main Stage Image */}
            <View style={styles.mainImageWrapper}>
              <Image source={{ uri: currentDisplayedImage }} style={styles.resultImage} />

              {/* Hold to Compare Button on Main Preview */}
              {selectedProduct && (
                <Pressable
                  onPressIn={() => handleCompareStart(selectedProduct.images[0])}
                  onPressOut={handleCompareEnd}
                  style={({ pressed }) => [
                    styles.holdCompareBtn,
                    (isComparing || pressed) && styles.holdCompareBtnActive,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Hold to compare with original"
                >
                  <Eye size={12} color={isComparing ? '#D4A373' : '#111111'} />
                  <Text style={[styles.holdCompareText, isComparing && styles.holdCompareTextActive]}>
                    {isComparing ? 'Comparing' : 'Hold to Compare'}
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Product Meta */}
            {selectedProduct && (
              <View style={styles.resultInfo}>
                <View>
                  <Text style={styles.resultProduct}>{selectedProduct.name}</Text>
                  <Text style={styles.resultSubtext}>
                    {resultImageUrl
                      ? 'Custom AI Render'
                      : activePreviewMode === 'garment'
                      ? 'Garment Preview'
                      : 'Silhouette Stage'}
                  </Text>
                </View>
                <Text style={styles.resultPrice}>${selectedProduct.price.toFixed(2)}</Text>
              </View>
            )}

            {/* Post-Generation Action Buttons */}
            {resultImageUrl && (
              <View style={styles.actionGrid}>
                <Button
                  title="ADD TO CART"
                  onPress={handleAddToCart}
                  icon={<ShoppingBag size={18} color="#FFFFFF" />}
                  style={{ flex: 1 }}
                />
                <Button
                  title="TRY AGAIN"
                  variant="outline"
                  onPress={() => {
                    setResultImageUrl(null);
                    setCapturedPhotoUri(null);
                  }}
                  icon={<RefreshCw size={16} color="#111111" />}
                />
              </View>
            )}
          </View>
        )}

        {/* Section 1: Silhouette / Photo Selector */}
        <View style={styles.selectorSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>1. CHOOSE SILHOUETTE / MODEL</Text>
            <View style={styles.cameraRowActions}>
              <TouchableOpacity
                onPress={handleLaunchCamera}
                style={styles.iconActionBtn}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Camera size={14} color="#111111" />
                <Text style={styles.iconActionText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePickFromGallery}
                style={styles.iconActionBtn}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <ImageIcon size={14} color="#111111" />
                <Text style={styles.iconActionText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Silhouette Thumbnails Carousel with CSS Selector Class & TestID */}
          <View
            style={styles.thumbnailContainer}
            testID="try-on-thumbnail-container"
            aria-label="try-on-thumbnail-container"
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.modelsScroll}
            >
              {PRESET_MODELS.map((m) => {
                const isSelected = selectedModelId === m.id && !capturedPhotoUri;
                const isItemComparing = comparingImageUrl === m.image;
                return (
                  <SilhouetteThumbnail
                    key={m.id}
                    model={m}
                    isSelected={isSelected}
                    onSelect={handleSelectModel}
                  />
                );
              })}
            </ScrollView>
          </View>

          {capturedPhotoUri && (
            <View style={styles.customPhotoNotice}>
              <Text style={styles.customPhotoText}>Custom photo active</Text>
              <TouchableOpacity onPress={() => setCapturedPhotoUri(null)}>
                <Text style={styles.customPhotoReset}>Switch to Presets</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Section 2: Garment Selector */}
        <View style={styles.selectorSection}>
          <Text style={styles.sectionHeader}>2. CHOOSE A T-SHIRT</Text>
          {/* Garment Thumbnails Carousel with CSS Selector Class & TestID */}
          <View
            style={styles.thumbnailContainer}
            testID="try-on-thumbnail-container-garments"
            aria-label="try-on-thumbnail-container"
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.garmentsScroll}
            >
              {products.map((p) => {
                const isSelected = selectedProduct?.id === p.id;
                return (
                  <GarmentThumbnail
                    key={p.id}
                    product={p}
                    isSelected={isSelected}
                    onSelect={handleSelectProduct}
                  />
                );
              })}
            </ScrollView>
          </View>
        </View>

        {/* Tip info box */}
        <View style={styles.tipCard}>
          <Info size={14} color="#666666" style={{ marginTop: 1 }} />
          <Text style={styles.tipText}>
            Single-tap any thumbnail to select it permanently. Hold &quot;Hold to Compare&quot; on the preview to temporarily inspect the original garment without affecting your selection.
          </Text>
        </View>

        {/* Action Button to Generate */}
        {!resultImageUrl && (
          <View style={styles.bottomCta}>
            <Button
              title={isProcessing ? 'PROCESSING LOOK...' : 'GENERATE TRY-ON LOOK'}
              onPress={handleGenerateLook}
              disabled={!selectedProduct || isProcessing}
              loading={isProcessing}
              icon={<Sparkles size={18} color="#FFFFFF" />}
              size="lg"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBE6',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#111111',
  },
  subtitle: {
    fontSize: 12,
    color: '#777777',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 60,
  },
  processingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#EBEBE6',
  },
  processingTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#111111',
    marginTop: 8,
  },
  processingSubtitle: {
    fontSize: 13,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 18,
  },
  resultContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EBEBE6',
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111',
    paddingVertical: 8,
    gap: 6,
  },
  resultBadgeComparing: {
    backgroundColor: '#D4A373',
  },
  resultBadgeText: {
    color: '#D4A373',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  resultBadgeTextComparing: {
    color: '#111111',
  },
  mainImageWrapper: {
    position: 'relative',
    width: '100%',
    height: 380,
    backgroundColor: '#F4F3EF',
  },
  resultImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  holdCompareBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  holdCompareBtnActive: {
    backgroundColor: '#111111',
  },
  holdCompareText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  holdCompareTextActive: {
    color: '#FFFFFF',
  },
  resultInfo: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0EB',
  },
  resultProduct: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
  },
  resultSubtext: {
    fontSize: 11,
    color: '#777777',
    marginTop: 2,
  },
  resultPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
  },
  actionGrid: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  selectorSection: {
    marginTop: 22,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#111111',
    marginBottom: 10,
  },
  cameraRowActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  iconActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0EFEA',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  iconActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111111',
  },
  modelsScroll: {
    gap: 10,
  },
  modelCard: {
    width: 90,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 6,
    borderWidth: 1.5,
    borderColor: '#EBEBE6',
  },
  modelCardActive: {
    borderColor: '#111111',
  },
  modelImage: {
    width: '100%',
    height: 100,
    borderRadius: 4,
  },
  modelName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111111',
    marginTop: 6,
    textAlign: 'center',
  },
  customPhotoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F3EF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
  },
  customPhotoText: {
    fontSize: 11,
    color: '#555555',
  },
  customPhotoReset: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111111',
  },
  garmentsScroll: {
    gap: 10,
  },
  garmentCard: {
    width: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 6,
    borderWidth: 1.5,
    borderColor: '#EBEBE6',
  },
  garmentCardActive: {
    borderColor: '#111111',
  },
  thumbnailWrapper: {
    position: 'relative',
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  garmentImage: {
    width: '100%',
    height: 120,
    borderRadius: 4,
  },
  checkBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  compareBadge: {
    position: 'absolute',
    bottom: 5,
    left: 4,
    right: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17, 17, 17, 0.82)',
    paddingVertical: 3.5,
    paddingHorizontal: 4,
    borderRadius: 12,
    gap: 3,
    zIndex: 2,
  },
  compareBadgeActive: {
    backgroundColor: '#D4A373',
  },
  compareBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  compareBadgeTextActive: {
    color: '#111111',
  },
  garmentName: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    color: '#111111',
  },
  garmentPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555555',
    marginTop: 2,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F4F3EF',
    padding: 10,
    borderRadius: 8,
    marginTop: 18,
  },
  tipText: {
    flex: 1,
    fontSize: 11,
    color: '#666666',
    lineHeight: 16,
  },
  bottomCta: {
    marginTop: 20,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  thumbnailContainer: {
    width: '100%',
  },
});

