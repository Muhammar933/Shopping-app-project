import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Heart, Sparkles } from 'lucide-react-native';
import { Product } from '../types';
import { theme } from '../constants/theme';
import { useFavoriteStore } from '../store/useFavoriteStore';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onTryOn?: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onTryOn,
}) => {
  const { isFavorited, toggleFavorite } = useFavoriteStore();
  const favorited = isFavorited(product.id);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: product.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Favorite Heart Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => toggleFavorite(product)}
          style={styles.favoriteButton}
        >
          <Heart
            size={18}
            color={favorited ? '#E53935' : '#111111'}
            fill={favorited ? '#E53935' : 'transparent'}
          />
        </TouchableOpacity>

        {/* Quick Try-On Badge */}
        {onTryOn && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onTryOn}
            style={styles.tryOnBadge}
          >
            <Sparkles size={12} color="#FFFFFF" />
            <Text style={styles.tryOnText}>TRY ON</Text>
          </TouchableOpacity>
        )}

        {/* Status Tag */}
        {product.isNew && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>NEW</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          {product.discountPrice && (
            <Text style={styles.discountPrice}>${product.discountPrice.toFixed(2)}</Text>
          )}
        </View>
        <Text style={styles.variantCount}>
          {product.variants.length} variations
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: 20,
  },
  imageWrapper: {
    width: '100%',
    height: CARD_WIDTH * 1.35,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surfaceSubtle,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tryOnBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 17, 17, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  tryOnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#111111',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 2,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  info: {
    marginTop: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  discountPrice: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  variantCount: {
    fontSize: 11,
    color: theme.colors.textTertiary,
    marginTop: 2,
  },
});
