import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';
import { Button } from '../../components/Button';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { orderNumber, total } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <CheckCircle2 size={48} color="#2E7D32" />
        </View>

        <Text style={styles.brandTitle}>THREADLY</Text>
        <Text style={styles.heading}>Order Confirmed</Text>
        <Text style={styles.orderNumber}>
          Order #{orderNumber || 'TH-2026-9812'}
        </Text>

        <Text style={styles.message}>
          Thank you for choosing Threadly. We are preparing your pieces for shipment with our signature eco-packaging.
        </Text>

        <View style={styles.receiptBox}>
          <Text style={styles.receiptLabel}>Amount Charged</Text>
          <Text style={styles.receiptValue}>${total || '110.00'}</Text>
        </View>

        <Button
          title="CONTINUE BROWSING"
          onPress={() => router.replace('/(tabs)/shop')}
          size="lg"
          style={{ width: '100%', marginTop: 24 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EBEBE6',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  brandTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#8A8A80',
    marginBottom: 6,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111111',
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginTop: 4,
  },
  message: {
    fontSize: 13,
    color: '#777777',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
  receiptBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#F7F7F4',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  receiptLabel: {
    fontSize: 13,
    color: '#666666',
  },
  receiptValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
  },
});
