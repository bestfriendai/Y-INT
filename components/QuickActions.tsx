/**
 * Quick Actions Component
 * Provides quick access to common features on the Home screen
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import Icon from '@/components/LucideIcons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface QuickAction {
  id: string;
  icon: string;
  label: string;
  gradient: [string, string];
  onPress: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps): React.JSX.Element {
  const handlePress = (action: QuickAction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    action.onPress();
  };

  return (
    <View style={styles.container}>
      <MotiView
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ delay: 100 }}
      >
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </MotiView>

      <View style={styles.actionsGrid}>
        {actions.map((action, index) => (
          <MotiView
            key={action.id}
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', delay: 150 + index * 100 }}
            style={styles.actionWrapper}
          >
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => handlePress(action)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={action.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionGradient}
              >
                <View style={styles.iconCircle}>
                  <Icon name={action.icon} size={24} color="#FFF" />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>
        ))}
      </View>
    </View>
  );
}

// Pre-configured quick actions for common use cases
export const DEFAULT_QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'scan',
    icon: 'Camera',
    label: 'Scan',
    gradient: ['#FF3B30', '#FF6B58'],
    onPress: () => {},
  },
  {
    id: 'nearby',
    icon: 'MapPin',
    label: 'Nearby',
    gradient: ['#34C759', '#4CD964'],
    onPress: () => {},
  },
  {
    id: 'compare',
    icon: 'Scale',
    label: 'Compare',
    gradient: ['#007AFF', '#5AC8FA'],
    onPress: () => {},
  },
  {
    id: 'plan',
    icon: 'Calendar',
    label: 'Plan Trip',
    gradient: ['#FF9500', '#FFCC00'],
    onPress: () => {},
  },
];

// Horizontal scrolling variant
interface QuickActionsScrollProps {
  actions: QuickAction[];
}

export function QuickActionsScroll({ actions }: QuickActionsScrollProps): React.JSX.Element {
  const handlePress = (action: QuickAction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    action.onPress();
  };

  return (
    <View style={styles.scrollContainer}>
      <MotiView
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ delay: 100 }}
        style={styles.headerRow}
      >
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </MotiView>

      <View style={styles.scrollContent}>
        {actions.map((action, index) => (
          <MotiView
            key={action.id}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', delay: 200 + index * 80 }}
          >
            <TouchableOpacity
              style={styles.scrollActionCard}
              onPress={() => handlePress(action)}
              activeOpacity={0.8}
            >
              <View style={[styles.scrollIconCircle, { backgroundColor: action.gradient[0] }]}>
                <Icon name={action.icon} size={22} color="#FFF" />
              </View>
              <Text style={styles.scrollActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          </MotiView>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionWrapper: {
    width: (SCREEN_WIDTH - 50 - 12) / 2,
  },
  actionCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  actionGradient: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    gap: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: -0.2,
  },
  // Scroll variant styles
  scrollContainer: {
    marginBottom: 24,
  },
  headerRow: {
    paddingHorizontal: 25,
    marginBottom: 16,
  },
  scrollContent: {
    flexDirection: 'row',
    paddingHorizontal: 25,
    gap: 16,
  },
  scrollActionCard: {
    alignItems: 'center',
    gap: 8,
  },
  scrollIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  scrollActionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});

export default QuickActions;
