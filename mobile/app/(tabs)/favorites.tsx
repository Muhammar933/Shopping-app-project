import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, ArrowRight } from 'lucide-react-native';
import { useFavoriteStore } from '../../store/useFavoriteStore';
import { ProductCard } from '../../components/ProductCard';
import { Button } from '../../components/Button';
import { theme } from '../../constants/theme';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites } = useFavoriteStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SAVED ITEMS</Text>
        <Text style={styles.count}>{favorites.length} saved</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.iconCircle}>
            <Heart size={32} color="#999999" />
          </View>
          <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Save your favorite cuts and colorways to try them on or purchase later.
          </Text>
          <Button
            title="EXPLORE COLLECTION"
            onPress={() => router.push('/(tabs)/shop')}
            style={{ marginTop: 24, paddingHorizontal: 28 }}
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.grid}>
          {favorites.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => router.push(`/product/${product.id}`)}
              onTryOn={() => router.push({ pathname: '/(tabs)/try-on', params: { productId: product.id } })}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBE6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#111111',
  },
  count: {
    fontSize: 13,
    color: '#777777',
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 16,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EFEFEA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 20,
  },
});
