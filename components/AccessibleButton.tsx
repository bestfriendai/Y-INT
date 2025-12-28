// components/AccessibleButton.tsx
// Accessible button wrapper with haptic feedback and proper touch targets
import React, { useCallback, memo } from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';

type HapticFeedbackType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'none';

interface AccessibleButtonProps extends Omit<TouchableOpacityProps, 'accessibilityRole'> {
  /** Required accessibility label describing the button action */
  accessibilityLabel: string;
  /** Optional hint providing additional context */
  accessibilityHint?: string;
  /** Type of haptic feedback to trigger on press */
  hapticFeedback?: HapticFeedbackType;
  /** Whether the button is in a loading state */
  loading?: boolean;
  /** Minimum touch target size (default: 44) */
  minTouchTarget?: number;
}

const hapticFeedbackMap = {
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  none: () => {},
};

export const AccessibleButton = memo<AccessibleButtonProps>(
  ({
    children,
    accessibilityLabel,
    accessibilityHint,
    hapticFeedback = 'light',
    loading = false,
    minTouchTarget = 44,
    onPress,
    onLongPress,
    disabled,
    style,
    ...props
  }) => {
    const handlePress = useCallback(
      (event: any) => {
        if (loading || disabled) return;

        // Trigger haptic feedback
        if (hapticFeedback !== 'none') {
          hapticFeedbackMap[hapticFeedback]();
        }

        onPress?.(event);
      },
      [hapticFeedback, loading, disabled, onPress]
    );

    const handleLongPress = useCallback(
      (event: any) => {
        if (loading || disabled) return;

        // Heavier haptic for long press
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        onLongPress?.(event);
      },
      [loading, disabled, onLongPress]
    );

    const minSizeStyle: ViewStyle = {
      minWidth: minTouchTarget,
      minHeight: minTouchTarget,
    };

    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole="button"
        accessibilityState={{
          disabled: disabled || loading,
          busy: loading,
        }}
        onPress={handlePress}
        onLongPress={onLongPress ? handleLongPress : undefined}
        disabled={disabled || loading}
        activeOpacity={0.7}
        style={[minSizeStyle, styles.centered, style]}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AccessibleButton;
