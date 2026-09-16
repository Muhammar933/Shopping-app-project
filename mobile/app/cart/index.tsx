import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react-native';
import { useCartStore } from '../../store/useCartStore';
import { Button } from '../../components/Button';
import { theme } from '../../constants/theme';

export default function CartModal() {
  const router = useRouter();
  const { cart, updateQuantity, removeItem, isLoading } = useCartStore();

  const items = cart?.items || [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#111111" />
        </TouchableOpacity>
        <Text style={styles.title}>SHOPPING BAG ({items.length})</Text>
        <View style={{ width: 28 }} />
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <ShoppingBag size={48} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>Your Bag is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Add classic heavyweights, oversized cuts, or vintage acid washes to your bag.
          </Text>
          <Button
            title="SHOP NOW"
            onPress={() => router.push('/(tabs)/shop')}
            style={{ marginTop: 24, paddingHorizontal: 32 }}
          />
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.itemList}>
            {items.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <Image source={{ uri: item.productImage }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.productName}
                  </Text>
                  <Text style={styles.itemVariant}>
                    Size: {item.size} • Color: {item.colorName}
                  </Text>
                  <Text style={styles.itemPrice}>${item.unitPrice.toFixed(2)}</Text>

                  <View style={styles.actionsRow}>
                    <View style={styles.stepper}>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} color={item.quantity <= 1 ? '#CCCCCC' : '#111111'} />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={14} color="#111111" />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={() => removeItem(item.id)}
                      style={styles.deleteBtn}
                    >
                      <Trash2 size={16} color="#999999" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {/* Summary card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${cart?.subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Estimated Shipping</Text>
                <Text style={styles.summaryValue}>
                  {cart && cart.shippingFee === 0 ? 'FREE' : `$${cart?.shippingFee.toFixed(2)}`}
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${cart?.total.toFixed(2)}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Sticky Checkout Button */}
          <View style={styles.checkoutBar}>
            <Button
              title={`CHECKOUT • $${cart?.total.toFixed(2)}`}
              onPress={() => router.push('/checkout')}
              size="lg"
            />
          </View>
        </>
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
  backBtn: {
    padding: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#111111',
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
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  itemList: {
    padding: 20,
    paddingBottom: 100,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EBEBE6',
    gap: 12,
  },
  itemImage: {
    width: 80,
    height: 100,
    borderRadius: 6,
    backgroundColor: '#F5F5F0',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
  },
  itemVariant: {
    fontSize: 12,
    color: '#777777',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E0',
    borderRadius: 4,
  },
  stepBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    color: '#111111',
  },
  deleteBtn: {
    padding: 4,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#EBEBE6',
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111111',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#EBEBE6',
    paddingTop: 10,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
  },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EBEBE6',
    padding: 20,
    paddingBottom: 32,
  },
});
