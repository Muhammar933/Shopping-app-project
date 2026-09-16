import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  ViewStyle,
  DimensionValue,
} from 'react-native';
import { theme } from '../constants/theme';

const { width } = Dimensions.get('window');
export const CARD_WIDTH = (width - 48) / 2;

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle | ViewStyle[];
}

/**
 * Base Shimmer Skeleton component with smooth looping opacity pulse
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 4,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 850,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.95],
  });

  return (
    <Animated.View
      style={[
        styles.skeletonBase,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

/**
 * Skeleton matching the exact geometry of ProductCard
 */
export const ProductCardSkeleton: React.FC = () => {
  return (
    <View style={styles.cardContainer}>
      {/* Image Container with Shimmer */}
      <View style={styles.imagePlaceholder}>
        <Skeleton
          width="100%"
          height="100%"
          borderRadius={theme.borderRadius.sm}
          style={styles.fullSize}
        />
        {/* Heart Favorite Circle Button Skeleton */}
        <View style={styles.favPlaceholder}>
          <Skeleton width={32} height={32} borderRadius={16} />
        </View>
        {/* Try-On Pill Skeleton */}
        <View style={styles.badgePlaceholder}>
          <Skeleton width={56} height={20} borderRadius={4} />
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.info}>
        {/* Title line */}
        <Skeleton width="85%" height={14} borderRadius={3} style={styles.nameSkeleton} />
        {/* Price line */}
        <View style={styles.priceRow}>
          <Skeleton width="40%" height={14} borderRadius={3} />
          <Skeleton width="25%" height={12} borderRadius={3} />
        </View>
        {/* Variation count line */}
        <Skeleton width="35%" height={10} borderRadius={3} style={styles.variantSkeleton} />
      </View>
    </View>
  );
};

interface ProductGridSkeletonProps {
  count?: number;
}

/**
 * Full 2-column Product Grid Skeleton
 */
export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({ count = 6 }) => {
  const items = Array.from({ length: count }, (_, idx) => idx);

  return (
    <View style={styles.grid}>
      {items.map((i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </View>
  );
};

/**
 * Skeleton for single Product Detail page
 */
export const ProductDetailSkeleton: React.FC = () => {
  return (
    <View style={styles.detailContainer}>
      {/* Big Hero Image placeholder */}
      <View style={styles.detailHeroImage}>
        <Skeleton width="100%" height="100%" borderRadius={0} style={styles.fullSize} />
      </View>
      {/* Content */}
      <View style={styles.detailContent}>
        <Skeleton width="30%" height={12} borderRadius={3} style={{ marginBottom: 10 }} />
        <Skeleton width="80%" height={22} borderRadius={4} style={{ marginBottom: 12 }} />
        <Skeleton width="45%" height={18} borderRadius={4} style={{ marginBottom: 20 }} />
        <Skeleton width="100%" height={50} borderRadius={theme.borderRadius.sm} style={{ marginBottom: 20 }} />
        <Skeleton width="40%" height={14} borderRadius={3} style={{ marginBottom: 10 }} />
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} width={42} height={42} borderRadius={21} />
          ))}
        </View>
        <Skeleton width="100%" height={48} borderRadius={theme.borderRadius.sm} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonBase: {
    backgroundColor: '#E4E3DE',
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: '100%',
    height: CARD_WIDTH * 1.35,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: '#EFEFEA',
    overflow: 'hidden',
    position: 'relative',
  },
  fullSize: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  favPlaceholder: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  badgePlaceholder: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  info: {
    marginTop: 8,
  },
  nameSkeleton: {
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  variantSkeleton: {
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  detailHeroImage: {
    width: '100%',
    height: width * 1.05,
    backgroundColor: '#EFEFEA',
    overflow: 'hidden',
    position: 'relative',
  },
  detailContent: {
    padding: 20,
  },
});
