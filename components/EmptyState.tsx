/**
 * Empty State Component
 * Provides beautiful empty states with illustrations and actions
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import Icon from '@/components/LucideIcons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type EmptyStateVariant = 'favorites' | 'search' | 'restaurants' | 'itineraries' | 'error' | 'offline';

interface EmptyStateProps {
  variant: EmptyStateVariant;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

const VARIANT_CONFIG: Record<EmptyStateVariant, { icon: string; iconColor: string; bgColor: string; defaultTitle: string; defaultMessage: string }> = {
  favorites: {
    icon: 'Heart',
    iconColor: '#FF3B30',
    bgColor: 'rgba(255, 59, 48, 0.1)',
    defaultTitle: 'No Favorites Yet',
    defaultMessage: 'Save your favorite restaurants by tapping the heart icon. They\'ll appear here for quick access.',
  },
  search: {
    icon: 'Search',
    iconColor: '#007AFF',
    bgColor: 'rgba(0, 122, 255, 0.1)',
    defaultTitle: 'No Results Found',
    defaultMessage: 'We couldn\'t find any restaurants matching your search. Try different keywords or filters.',
  },
  restaurants: {
    icon: 'UtensilsCrossed',
    iconColor: '#FF9500',
    bgColor: 'rgba(255, 149, 0, 0.1)',
    defaultTitle: 'No Restaurants Nearby',
    defaultMessage: 'We couldn\'t find restaurants in your area. Try expanding your search radius or check your location settings.',
  },
  itineraries: {
    icon: 'Map',
    iconColor: '#34C759',
    bgColor: 'rgba(52, 199, 89, 0.1)',
    defaultTitle: 'No Saved Itineraries',
    defaultMessage: 'Plan your food adventures! Create your first itinerary to save it here.',
  },
  error: {
    icon: 'AlertCircle',
    iconColor: '#FF3B30',
    bgColor: 'rgba(255, 59, 48, 0.1)',
    defaultTitle: 'Something Went Wrong',
    defaultMessage: 'We encountered an error. Please try again or check your connection.',
  },
  offline: {
    icon: 'WifiOff',
    iconColor: '#8E8E93',
    bgColor: 'rgba(142, 142, 147, 0.1)',
    defaultTitle: 'No Internet Connection',
    defaultMessage: 'Please check your connection and try again. Some features may be limited offline.',
  },
};

export function EmptyState({
  variant,
  title,
  message,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps): React.JSX.Element {
  const config = VARIANT_CONFIG[variant];

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 15 }}
      style={styles.container}
    >
      {/* Decorative circles */}
      <View style={styles.decorativeContainer}>
        <MotiView
          from={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ delay: 200 }}
          style={[styles.decorativeCircle, styles.circle1]}
        />
        <MotiView
          from={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ delay: 300 }}
          style={[styles.decorativeCircle, styles.circle2]}
        />
        <MotiView
          from={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ delay: 400 }}
          style={[styles.decorativeCircle, styles.circle3]}
        />
      </View>

      {/* Icon Container */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 100, type: 'spring' }}
        style={[styles.iconWrapper, { backgroundColor: config.bgColor }]}
      >
        <Icon name={config.icon} size={48} color={config.iconColor} />
      </MotiView>

      {/* Title */}
      <MotiView
        from={{ opacity: 0, translateY: 15 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 200 }}
      >
        <Text style={styles.title}>{title || config.defaultTitle}</Text>
      </MotiView>

      {/* Message */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 300 }}
      >
        <Text style={styles.message}>{message || config.defaultMessage}</Text>
      </MotiView>

      {/* Action Buttons */}
      {(actionLabel || secondaryActionLabel) && (
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 400 }}
          style={styles.actionsContainer}
        >
          {actionLabel && onAction && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onAction}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FF3B30', '#FF6B58']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButtonGradient}
              >
                <Text style={styles.primaryButtonText}>{actionLabel}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {secondaryActionLabel && onSecondaryAction && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onSecondaryAction}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>{secondaryActionLabel}</Text>
            </TouchableOpacity>
          )}
        </MotiView>
      )}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
    minHeight: 400,
  },
  decorativeContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: '#FF3B30',
  },
  circle1: {
    width: 200,
    height: 200,
  },
  circle2: {
    width: 280,
    height: 280,
  },
  circle3: {
    width: 360,
    height: 360,
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    maxWidth: SCREEN_WIDTH * 0.75,
  },
  actionsContainer: {
    alignItems: 'center',
    gap: 12,
  },
  primaryButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default EmptyState;
