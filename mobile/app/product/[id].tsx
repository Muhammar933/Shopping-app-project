import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Heart,
  Sparkles,
  ShoppingBag,
  Star,
  Check,
  ShieldAlert,
} from 'lucide-react-native';
import { productService } from '../../services/productService';
import { Product, ProductVariant } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { useFavoriteStore } from '../../store/useFavoriteStore';
import { Button } from '../../components/Button';
import { ProductDetailSkeleton } from '../../components/Skeleton';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [adding, setAdding] = useState(false);

  const addItemToCart = useCartStore((s) => s.addItem);
  const { isFavorited, toggleFavorite } = useFavoriteStore();

  useEffect(() => {
    if (id) {
      productService.getProductById(id as string).then((p) => {
        setProduct(p);
        if (p.variants.length > 0) {
          setSelectedSize(p.variants[0].size);
          setSelectedColor(p.variants[0].colorName);
        }
      });
    }
  }, [id]);

  if (!product) {
    return <ProductDetailSkeleton />;
  }

  const favorited = isFavorited(product.id);

  // Available unique colors and sizes
  const uniqueColors = Array.from(
    new Set(product.variants.map((v) => JSON.stringify({ name: v.colorName, hex: v.colorHex })))
  ).map((s: string) => JSON.parse(s));

  const uniqueSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'].filter((s) =>
    product.variants.some((v) => v.size === s)
  );

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.colorName === selectedColor
  ) || product.variants[0];

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setAdding(true);
    try {
      await addItemToCart(product.id, selectedVariant.id, 1);
      Alert.alert(
        'Added to Bag',
        `${product.name} (${selectedSize}, ${selectedColor}) has been added.`,
        [
          { text: 'Keep Shopping', style: 'cancel' },
          { text: 'View Bag', onPress: () => router.push('/cart') },
        ]
      );
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <ArrowLeft size={22} color="#111111" />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          {product.name}
        </Text>
        <TouchableOpacity
          onPress={() => toggleFavorite(product)}
          style={styles.navBtn}
        >
          <Heart
            size={22}
            color={favorited ? '#E53935' : '#111111'}
            fill={favorited ? '#E53935' : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery Carousel */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveImageIndex(index);
          }}
          scrollEventThrottle={16}
        >
          {product.images.map((img, idx) => (
            <Image key={idx} source={{ uri: img }} style={styles.carouselImage} />
          ))}
        </ScrollView>

        {/* Dots indicator */}
        {product.images.length > 1 && (
          <View style={styles.dotsRow}>
            {product.images.map((_, idx) => (
              <View
                key={idx}
                style={[styles.dot, activeImageIndex === idx && styles.dotActive]}
              />
            ))}
          </View>
        )}

        <View style={styles.detailsBody}>
          {/* Tag & Category */}
          <Text style={styles.categoryLabel}>{product.category?.name || 'ESSENTIALS'}</Text>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            {product.discountPrice && (
              <Text style={styles.discountPrice}>${product.discountPrice.toFixed(2)}</Text>
            )}
            <View style={styles.ratingBadge}>
              <Star size={14} color="#D4A373" fill="#D4A373" />
              <Text style={styles.ratingText}>4.9 (42 reviews)</Text>
            </View>
          </View>

          {/* Virtual Try-On Highlight CTA */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => router.push({ pathname: '/(tabs)/try-on', params: { productId: product.id } })}
            style={styles.tryOnBanner}
          >
            <View style={styles.tryOnBannerLeft}>
              <View style={styles.tryOnPill}>
                <Sparkles size={14} color="#D4A373" />
                <Text style={styles.tryOnPillText}>VIRTUAL FITTING ROOM</Text>
              </View>
              <Text style={styles.tryOnTitle}>See this T-shirt on yourself</Text>
              <Text style={styles.tryOnSub}>Take or upload a photo to preview fit.</Text>
            </View>
            <View style={styles.tryOnAction}>
              <Text style={styles.tryOnActionText}>TRY ON</Text>
            </View>
          </TouchableOpacity>

          {/* Color Selector */}
          <View style={styles.selectorBlock}>
            <Text style={styles.selectorTitle}>COLOR: {selectedColor}</Text>
            <View style={styles.colorRow}>
              {uniqueColors.map((col: any) => {
                const isSelected = selectedColor === col.name;
                return (
                  <TouchableOpacity
                    key={col.name}
                    style={[styles.colorChip, isSelected && styles.colorChipActive]}
                    onPress={() => setSelectedColor(col.name)}
                  >
                    <View style={[styles.colorSwatch, { backgroundColor: col.hex }]} />
                    <Text style={[styles.colorName, isSelected && styles.colorNameActive]}>
                      {col.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Size Selector */}
          <View style={styles.selectorBlock}>
            <View style={styles.sizeHeaderRow}>
              <Text style={styles.selectorTitle}>SELECT SIZE</Text>
              <TouchableOpacity>
                <Text style={styles.sizeGuideLink}>Size Guide</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sizeRow}>
              {uniqueSizes.map((sz) => {
                const isSelected = selectedSize === sz;
                return (
                  <TouchableOpacity
                    key={sz}
                    style={[styles.sizeBtn, isSelected && styles.sizeBtnActive]}
                    onPress={() => setSelectedSize(sz)}
                  >
                    <Text style={[styles.sizeText, isSelected && styles.sizeTextActive]}>
                      {sz}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Description */}
          <View style={styles.descBlock}>
            <Text style={styles.descTitle}>CRAFT & FABRIC</Text>
            <Text style={styles.descContent}>{product.description}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceCol}>
          <Text style={styles.bottomLabel}>TOTAL</Text>
          <Text style={styles.bottomPrice}>${product.price.toFixed(2)}</Text>
        </View>
        <Button
          title={adding ? 'ADDING...' : 'ADD TO BAG'}
          onPress={handleAddToCart}
          loading={adding}
          icon={<ShoppingBag size={18} color="#FFFFFF" />}
          style={{ flex: 1 }}
          size="lg"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0EB',
    zIndex: 10,
  },
  navBtn: {
    padding: 6,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  carouselImage: {
    width: width,
    height: width * 1.2,
    resizeMode: 'cover',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D1C7',
  },
  dotActive: {
    backgroundColor: '#111111',
    width: 18,
  },
  detailsBody: {
    padding: 20,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#8A8A80',
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111111',
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
  },
  discountPrice: {
    fontSize: 16,
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    color: '#555555',
    fontWeight: '600',
  },
  tryOnBanner: {
    marginTop: 20,
    backgroundColor: '#F7F4EE',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7DEC8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tryOnBannerLeft: {
    flex: 1,
    gap: 4,
  },
  tryOnPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tryOnPillText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#8A5D2C',
  },
  tryOnTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
  },
  tryOnSub: {
    fontSize: 12,
    color: '#666666',
  },
  tryOnAction: {
    backgroundColor: '#111111',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  tryOnActionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  selectorBlock: {
    marginTop: 24,
  },
  selectorTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#111111',
    marginBottom: 10,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  colorChipActive: {
    borderColor: '#111111',
    backgroundColor: '#F9F9F7',
  },
  colorSwatch: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  colorName: {
    fontSize: 12,
    color: '#555555',
    fontWeight: '500',
  },
  colorNameActive: {
    color: '#111111',
    fontWeight: '700',
  },
  sizeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sizeGuideLink: {
    fontSize: 12,
    color: '#777777',
    textDecorationLine: 'underline',
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sizeBtn: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E5E0',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeBtnActive: {
    borderColor: '#111111',
    backgroundColor: '#111111',
  },
  sizeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111111',
  },
  sizeTextActive: {
    color: '#FFFFFF',
  },
  descBlock: {
    marginTop: 28,
    borderTopWidth: 1,
    borderTopColor: '#F0F0EB',
    paddingTop: 20,
  },
  descTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#111111',
    marginBottom: 8,
  },
  descContent: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EBEBE6',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  bottomPriceCol: {
    justifyContent: 'center',
  },
  bottomLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#888888',
    letterSpacing: 0.5,
  },
  bottomPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
  },
});
