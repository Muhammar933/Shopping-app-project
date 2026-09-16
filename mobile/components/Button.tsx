import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const isOutline = variant === 'outline';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        styles[size],
        isOutline && styles.outline,
        isSecondary && styles.secondary,
        isGhost && styles.ghost,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline || isGhost ? theme.colors.primary : '#FFFFFF'} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              styles[`${size}Text`],
              isOutline && styles.outlineText,
              isSecondary && styles.secondaryText,
              isGhost && styles.ghostText,
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.primary,
    gap: 8,
  },
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  md: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  lg: {
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.borderFocus,
  },
  secondary: {
    backgroundColor: theme.colors.surfaceSubtle,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  smText: {
    fontSize: 12,
  },
  mdText: {
    fontSize: 14,
  },
  lgText: {
    fontSize: 15,
  },
  outlineText: {
    color: theme.colors.textPrimary,
  },
  secondaryText: {
    color: theme.colors.textPrimary,
  },
  ghostText: {
    color: theme.colors.textSecondary,
  },
  disabledText: {
    color: theme.colors.textTertiary,
  },
});
