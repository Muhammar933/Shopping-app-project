import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, ArrowRight, ShoppingBag } from 'lucide-react-native';
import { productService } from '../../services/productService';
import { Product, Category } from '../../types';
import { ProductCard } from '../../components/ProductCard';
import { ProductCardSkeleton } from '../../components/Skeleton';
import { Button } from '../../components/Button';
import { theme } from '../../constants/theme';
import { useCartStore } from '../../store/useCartStore';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const cart = useCartStore((s) => s.cart);

  const loadData = async () => {
    try {
      const [prods, cats] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const newCollection = products.filter((p) => p.isNew).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>THREADLY</Text>
        <TouchableOpacity
          onPress={() => router.push('/cart')}
          style={styles.cartBtn}
        >
          <ShoppingBag size={22} color={theme.colors.primary} />
          {cart && cart.itemCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cart.itemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&q=85' }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTagline}>WEAR YOUR STYLE.</Text>
            <Text style={styles.heroSubtitle}>
              Premium essentials designed for everyday confidence.
            </Text>
            <View style={styles.heroButtons}>
              <Button
                title="SHOP NOW"
                onPress={() => router.push('/(tabs)/shop')}
                style={styles.heroBtnPrimary}
                size="md"
              />
              <Button
                title="TRY IT ON"
                onPress={() => router.push('/(tabs)/try-on')}
                variant="outline"
                style={styles.heroBtnOutline}
                textStyle={{ color: '#FFFFFF' }}
                icon={<Sparkles size={16} color="#FFFFFF" />}
                size="md"
              />
            </View>
          </View>
        </View>

        {/* Categories Carousel */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>CATEGORIES</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              onPress={() => router.push({ pathname: '/(tabs)/shop', params: { category: cat.slug } })}
            >
              <Image source={{ uri: cat.imageUrl }} style={styles.categoryImage} />
              <View style={styles.categoryOverlay} />
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Virtual Try-On Highlight Promo */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push('/(tabs)/try-on')}
          style={styles.tryOnBanner}
        >
          <View style={styles.tryOnBannerContent}>
            <View style={styles.tryOnPill}>
              <Sparkles size={14} color="#D4A373" />
              <Text style={styles.tryOnPillText}>AI VIRTUAL FITTING ROOM</Text>
            </View>
            <Text style={styles.tryOnBannerTitle}>See How It Fits You</Text>
            <Text style={styles.tryOnBannerSubtitle}>
              Snap a quick photo and preview Threadly cuts on your body before ordering.
            </Text>
            <View style={styles.tryOnLink}>
              <Text style={styles.tryOnLinkText}>LAUNCH TRY-ON</Text>
              <ArrowRight size={16} color="#111111" />
            </View>
          </View>
        </TouchableOpacity>

        {/* New Collection */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>NEW COLLECTION</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/shop')}>
            <Text style={styles.seeAll}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.grid}>
          {products.length === 0 ? (
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          ) : (
            newCollection.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => router.push(`/product/${product.id}`)}
                onTryOn={() => router.push({ pathname: '/(tabs)/try-on', params: { productId: product.id } })}
              />
            ))
          )}
        </View>

        {/* Best Sellers */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>BEST SELLERS</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/shop')}>
            <Text style={styles.seeAll}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.grid}>
          {products.length === 0 ? (
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          ) : (
            bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => router.push(`/product/${product.id}`)}
                onTryOn={() => router.push({ pathname: '/(tabs)/try-on', params: { productId: product.id } })}
              />
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
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
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#111111',
  },
  cartBtn: {
    position: 'relative',
    padding: 6,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#111111',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  heroContainer: {
    width: width,
    height: 440,
    position: 'relative',
    justifyContent: 'flex-end',
    padding: 24,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  heroContent: {
    zIndex: 2,
  },
  heroTagline: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    marginTop: 8,
    lineHeight: 22,
    maxWidth: '85%',
  },
  heroButtons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  heroBtnPrimary: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  heroBtnOutline: {
    borderColor: '#FFFFFF',
    borderWidth: 1.5,
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 36,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#111111',
  },
  seeAll: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777777',
  },
  categoriesScroll: {
    paddingLeft: 20,
    paddingRight: 10,
    gap: 12,
  },
  categoryCard: {
    width: 140,
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
    padding: 12,
  },
  categoryImage: {
    ...StyleSheet.absoluteFillObject,
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  categoryName: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  tryOnBanner: {
    marginHorizontal: 20,
    marginTop: 32,
    backgroundColor: '#F3EFEA',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E6DEC9',
  },
  tryOnBannerContent: {
    gap: 8,
  },
  tryOnPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tryOnPillText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#8A5D2C',
  },
  tryOnBannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
  },
  tryOnBannerSubtitle: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
  },
  tryOnLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  tryOnLinkText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#111111',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
});
