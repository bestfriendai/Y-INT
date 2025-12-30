/**
 * Toast Notification Component
 * Provides visual feedback for user actions
 */

import React, { useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Dimensions, Platform } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { BlurView } from 'expo-blur';
import Icon from '@/components/LucideIcons';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastConfig {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastConfig;
  onDismiss: (id: string) => void;
}

const TOAST_ICONS: Record<ToastType, string> = {
  success: 'CheckCircle',
  error: 'XCircle',
  info: 'Info',
  warning: 'AlertTriangle',
};

const TOAST_COLORS: Record<ToastType, { bg: string; icon: string; border: string }> = {
  success: { bg: 'rgba(52, 199, 89, 0.15)', icon: '#34C759', border: 'rgba(52, 199, 89, 0.3)' },
  error: { bg: 'rgba(255, 59, 48, 0.15)', icon: '#FF3B30', border: 'rgba(255, 59, 48, 0.3)' },
  info: { bg: 'rgba(0, 122, 255, 0.15)', icon: '#007AFF', border: 'rgba(0, 122, 255, 0.3)' },
  warning: { bg: 'rgba(255, 149, 0, 0.15)', icon: '#FF9500', border: 'rgba(255, 149, 0, 0.3)' },
};

function Toast({ toast, onDismiss }: ToastProps): React.JSX.Element {
  const { id, type, message, duration = 3000 } = toast;
  const colors = TOAST_COLORS[type];
  const iconName = TOAST_ICONS[type];

  useEffect(() => {
    // Trigger haptic feedback based on toast type
    if (type === 'success') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (type === 'error') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else if (type === 'warning') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, type, duration, onDismiss]);

  return (
    <MotiView
      from={{ opacity: 0, translateY: -20, scale: 0.9 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      exit={{ opacity: 0, translateY: -20, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      style={styles.toastWrapper}
    >
      <BlurView intensity={80} tint="light" style={[styles.toastContainer, { borderColor: colors.border }]}>
        <View style={[styles.iconContainer, { backgroundColor: colors.bg }]}>
          <Icon name={iconName} size={20} color={colors.icon} />
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
      </BlurView>
    </MotiView>
  );
}

// Toast Provider Context
interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  hideToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export function useToast(): ToastContextType {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps): React.JSX.Element {
  const [toasts, setToasts] = React.useState<ToastConfig[]>([]);

  const showToast = useCallback((type: ToastType, message: string, duration = 3000) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev.slice(-2), { id, type, message, duration }]); // Keep max 3 toasts
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <View style={styles.toastStack} pointerEvents="box-none">
        <AnimatePresence>
          {toasts.map((toast, index) => (
            <Toast key={toast.id} toast={toast} onDismiss={hideToast} />
          ))}
        </AnimatePresence>
      </View>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  toastStack: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    pointerEvents: 'box-none',
  },
  toastWrapper: {
    marginBottom: 8,
    width: SCREEN_WIDTH - 40,
    maxWidth: 400,
  },
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 20,
  },
});

export default Toast;
