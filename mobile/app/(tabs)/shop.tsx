import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, SlidersHorizontal, X } from 'lucide-react-native';
import { productService } from '../../services/productService';
import { Product, Category } from '../../types';
import { ProductCard } from '../../components/ProductCard';
import { ProductGridSkeleton } from '../../components/Skeleton';
import { theme } from '../../constants/theme';

export default function ShopScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'popular'>('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedCategory, sortBy]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        productService.getProducts({
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          search: searchQuery || undefined,
          sort: sortBy,
        }),
        productService.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadData();
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Search size={18} color="#777777" />
          <TextInput
            placeholder="Search heavyweight, oversized, wash..."
            placeholderTextColor="#999999"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#777777" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Pills */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsScroll}
        >
          <TouchableOpacity
            style={[styles.pill, selectedCategory === 'all' && styles.pillActive]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text
              style={[
                styles.pillText,
                selectedCategory === 'all' && styles.pillTextActive,
              ]}
            >
              All T-Shirts
            </Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.pill, selectedCategory === cat.slug && styles.pillActive]}
              onPress={() => setSelectedCategory(cat.slug)}
            >
              <Text
                style={[
                  styles.pillText,
                  selectedCategory === cat.slug && styles.pillTextActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sort & Count Bar */}
      <View style={styles.subBar}>
        <Text style={styles.countText}>
          {products.length} {products.length === 1 ? 'Design' : 'Designs'}
        </Text>
        <View style={styles.sortWrapper}>
          <TouchableOpacity
            onPress={() =>
              setSortBy((prev) =>
                prev === 'newest'
                  ? 'popular'
                  : prev === 'popular'
                  ? 'price_asc'
                  : prev === 'price_asc'
                  ? 'price_desc'
                  : 'newest'
              )
            }
            style={styles.sortBtn}
          >
            <SlidersHorizontal size={14} color="#111111" />
            <Text style={styles.sortText}>
              Sort: {sortBy.replace('_', ' ').toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Product Grid */}
      {loading ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <ProductGridSkeleton count={6} />
        </ScrollView>
      ) : products.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No T-Shirts Found</Text>
          <Text style={styles.emptySubtitle}>Try adjusting your search or category filters.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.grid}>
          {products.map((product) => (
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
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3EF',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111111',
  },
  filterSection: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBE6',
    paddingVertical: 10,
  },
  pillsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F3F3EF',
  },
  pillActive: {
    backgroundColor: '#111111',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  subBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  countText: {
    fontSize: 13,
    color: '#777777',
    fontWeight: '500',
  },
  sortWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sortText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111111',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
  },
});
