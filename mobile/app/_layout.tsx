import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useFavoriteStore } from '../store/useFavoriteStore';

export default function RootLayout() {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const fetchFavorites = useFavoriteStore((s) => s.fetchFavorites);

  useEffect(() => {
    checkAuth();
    fetchCart();
    fetchFavorites();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="product/[id]"
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="try-on/camera"
          options={{
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="cart/index"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="checkout/index"
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="checkout/success"
          options={{
            presentation: 'card',
            gestureEnabled: false,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
