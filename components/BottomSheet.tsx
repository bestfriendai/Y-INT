/**
 * Bottom Sheet Component
 * Reusable bottom sheet for filters, actions, and more
 */

import React, { useCallback, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { BlurView } from 'expo-blur';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import Icon from '@/components/LucideIcons';
import * as Haptics from 'expo-haptics';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapPoints?: number[];
  initialSnap?: number;
  showHandle?: boolean;
  showCloseButton?: boolean;
}

export function BottomSheet({
  visible,
  onClose,
  title,
  children,
  snapPoints = [0.5, 0.9],
  initialSnap = 0,
  showHandle = true,
  showCloseButton = true,
}: BottomSheetProps): React.JSX.Element {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const currentSnapIndex = useSharedValue(initialSnap);

  const snapHeights = useMemo(
    () => snapPoints.map((point) => SCREEN_HEIGHT * (1 - point)),
    [snapPoints]
  );

  const closeSheet = useCallback(() => {
    translateY.value = withSpring(SCREEN_HEIGHT, { damping: 20, stiffness: 300 });
    onClose();
  }, [onClose, translateY]);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(snapHeights[initialSnap], {
        damping: 20,
        stiffness: 300,
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      translateY.value = withSpring(SCREEN_HEIGHT, { damping: 20, stiffness: 300 });
    }
  }, [visible, snapHeights, initialSnap, translateY]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newY = snapHeights[currentSnapIndex.value] + event.translationY;
      if (newY >= snapHeights[snapHeights.length - 1] && newY <= SCREEN_HEIGHT) {
        translateY.value = newY;
      }
    })
    .onEnd((event) => {
      // Find closest snap point
      const currentY = translateY.value;
      const velocity = event.velocityY;

      // If swiped down fast, close
      if (velocity > 500) {
        runOnJS(closeSheet)();
        return;
      }

      // Find closest snap point
      let closestSnap = 0;
      let minDistance = Math.abs(currentY - snapHeights[0]);

      for (let i = 1; i < snapHeights.length; i++) {
        const distance = Math.abs(currentY - snapHeights[i]);
        if (distance < minDistance) {
          minDistance = distance;
          closestSnap = i;
        }
      }

      // If below first snap and dragged down significantly, close
      if (currentY > snapHeights[0] + 100) {
        runOnJS(closeSheet)();
        return;
      }

      currentSnapIndex.value = closestSnap;
      translateY.value = withSpring(snapHeights[closestSnap], {
        damping: 20,
        stiffness: 300,
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return <></>;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={closeSheet}
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <AnimatePresence>
          {visible && (
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={StyleSheet.absoluteFill}
            >
              <Pressable style={styles.backdrop} onPress={closeSheet}>
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              </Pressable>
            </MotiView>
          )}
        </AnimatePresence>

        {/* Sheet */}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.sheet, animatedStyle]}>
            {/* Handle */}
            {showHandle && (
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>
            )}

            {/* Header */}
            {(title || showCloseButton) && (
              <View style={styles.header}>
                <Text style={styles.title}>{title || ''}</Text>
                {showCloseButton && (
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closeSheet}
                    activeOpacity={0.7}
                  >
                    <Icon name="X" size={20} color="#8E8E93" />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Content */}
            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {children}
            </ScrollView>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

// Filter Bottom Sheet specifically for restaurant filtering
interface FilterOption {
  id: string;
  label: string;
  selected: boolean;
}

interface FilterSection {
  title: string;
  options: FilterOption[];
}

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterSection[];
  onApply: (filters: FilterSection[]) => void;
  onReset: () => void;
}

export function FilterBottomSheet({
  visible,
  onClose,
  filters,
  onApply,
  onReset,
}: FilterBottomSheetProps): React.JSX.Element {
  const [localFilters, setLocalFilters] = React.useState<FilterSection[]>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const toggleOption = (sectionIndex: number, optionId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLocalFilters((prev) =>
      prev.map((section, idx) =>
        idx === sectionIndex
          ? {
              ...section,
              options: section.options.map((opt) =>
                opt.id === optionId ? { ...opt, selected: !opt.selected } : opt
              ),
            }
          : section
      )
    );
  };

  const handleApply = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLocalFilters((prev) =>
      prev.map((section) => ({
        ...section,
        options: section.options.map((opt) => ({ ...opt, selected: false })),
      }))
    );
    onReset();
  };

  const selectedCount = localFilters.reduce(
    (acc, section) => acc + section.options.filter((o) => o.selected).length,
    0
  );

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Filters" snapPoints={[0.6, 0.9]}>
      <View style={styles.filterContent}>
        {localFilters.map((section, sectionIndex) => (
          <View key={section.title} style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>{section.title}</Text>
            <View style={styles.filterOptions}>
              {section.options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.filterChip,
                    option.selected && styles.filterChipSelected,
                  ]}
                  onPress={() => toggleOption(sectionIndex, option.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      option.selected && styles.filterChipTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {option.selected && (
                    <Icon name="Check" size={14} color="#FF3B30" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Actions */}
        <View style={styles.filterActions}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <Text style={styles.resetButtonText}>Reset All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApply}
            activeOpacity={0.8}
          >
            <Text style={styles.applyButtonText}>
              Apply{selectedCount > 0 ? ` (${selectedCount})` : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E5E5EA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  filterContent: {
    gap: 24,
  },
  filterSection: {
    gap: 12,
  },
  filterSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F7',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  filterChipSelected: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderColor: '#FF3B30',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  filterChipTextSelected: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#F5F5F7',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#FF3B30',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});

export default BottomSheet;
