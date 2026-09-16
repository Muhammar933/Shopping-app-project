import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Text } from 'react-native';
import { Home, Compass, Sparkles, Heart, User } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { useCartStore } from '../../store/useCartStore';

export default function TabsLayout() {
  const cart = useCartStore((s) => s.cart);
  const itemCount = cart?.itemCount || 0;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, size }) => <Compass size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="try-on"
        options={{
          title: 'Try-On',
          tabBarIcon: ({ color }) => (
            <View style={styles.tryOnIconWrapper}>
              <Sparkles size={20} color="#FFFFFF" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, size }) => <Heart size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  tryOnIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
});
