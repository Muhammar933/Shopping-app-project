import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/Button';
import { theme } from '../../constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MY ACCOUNT</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user ? `${user.firstName[0]}${user.lastName[0]}` : 'TH'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user ? `${user.firstName} ${user.lastName}` : 'Guest Explorer'}
            </Text>
            <Text style={styles.userEmail}>
              {user ? user.email : 'Sign in to access orders and saved fits'}
            </Text>
            {user?.role === 'ADMIN' && (
              <View style={styles.adminBadge}>
                <ShieldCheck size={12} color="#D4A373" />
                <Text style={styles.adminBadgeText}>THREADLY ADMIN</Text>
              </View>
            )}
          </View>
        </View>

        {!isAuthenticated && (
          <View style={styles.authBanner}>
            <Text style={styles.authBannerText}>Unlock member benefits & order tracking</Text>
            <Button
              title="SIGN IN / REGISTER"
              onPress={() => router.push('/(auth)/login' as any)}
              size="sm"
              style={{ marginTop: 10 }}
            />
          </View>
        )}

        {/* Menu Sections */}
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/orders' as any)}
          >
            <View style={styles.menuItemLeft}>
              <Package size={20} color="#111111" />
              <Text style={styles.menuItemText}>Order History & Tracking</Text>
            </View>
            <ChevronRight size={18} color="#999999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(tabs)/favorites')}
          >
            <View style={styles.menuItemLeft}>
              <Heart size={20} color="#111111" />
              <Text style={styles.menuItemText}>Saved Wishlist</Text>
            </View>
            <ChevronRight size={18} color="#999999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <MapPin size={20} color="#111111" />
              <Text style={styles.menuItemText}>Shipping Addresses</Text>
            </View>
            <ChevronRight size={18} color="#999999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Settings size={20} color="#111111" />
              <Text style={styles.menuItemText}>App Preferences</Text>
            </View>
            <ChevronRight size={18} color="#999999" />
          </TouchableOpacity>
        </View>

        {isAuthenticated && (
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut size={18} color="#D32F2F" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <Text style={styles.brandFooter}>THREADLY STUDIO</Text>
          <Text style={styles.versionFooter}>Version 1.0.0 • Mobile Client Build 2026</Text>
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBE6',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#111111',
  },
  scroll: {
    padding: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EBEBE6',
    gap: 16,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
  },
  userEmail: {
    fontSize: 13,
    color: '#777777',
    marginTop: 2,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    backgroundColor: '#1C1C1E',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adminBadgeText: {
    color: '#D4A373',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  authBanner: {
    marginTop: 16,
    backgroundColor: '#F3EFEA',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E6DEC9',
  },
  authBannerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#554228',
  },
  menuSection: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EBEBE6',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111111',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 24,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#FFD4D4',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D32F2F',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
    gap: 4,
  },
  brandFooter: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#999999',
  },
  versionFooter: {
    fontSize: 11,
    color: '#BBBBBB',
  },
});
