/**
 * Skeleton Loader Components
 * Provides loading placeholders for better perceived performance
 */

import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: object;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonProps): React.JSX.Element {
  return (
    <MotiView
      from={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{
        type: 'timing',
        duration: 800,
        loop: true,
      }}
      style={[
        styles.skeleton,
        {
          width: typeof width === 'number' ? width : width,
          height,
          borderRadius,
        },
        style,
      ]}
    />
  );
}

export function RestaurantCardSkeleton(): React.JSX.Element {
  return (
    <View style={styles.restaurantCard}>
      <Skeleton width={SCREEN_WIDTH * 0.75} height={420} borderRadius={35} />
    </View>
  );
}

export function RestaurantListSkeleton({ count = 3 }: { count?: number }): React.JSX.Element {
  return (
    <View style={styles.listContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <MotiView
          key={index}
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: index * 100 }}
        >
          <RestaurantRowSkeleton />
        </MotiView>
      ))}
    </View>
  );
}

export function RestaurantRowSkeleton(): React.JSX.Element {
  return (
    <View style={styles.rowCard}>
      <Skeleton width={85} height={85} borderRadius={16} />
      <View style={styles.rowContent}>
        <Skeleton width="80%" height={18} borderRadius={6} />
        <View style={{ height: 8 }} />
        <Skeleton width="60%" height={14} borderRadius={6} />
        <View style={{ height: 8 }} />
        <View style={styles.rowInfo}>
          <Skeleton width={60} height={14} borderRadius={6} />
          <Skeleton width={80} height={14} borderRadius={6} />
        </View>
      </View>
    </View>
  );
}

export function DiscoverCardSkeleton(): React.JSX.Element {
  return (
    <View style={styles.discoverCard}>
      <Skeleton width={SCREEN_WIDTH * 0.6} height={240} borderRadius={25} />
    </View>
  );
}

export function DiscoverListSkeleton({ count = 3 }: { count?: number }): React.JSX.Element {
  return (
    <View style={styles.horizontalList}>
      {Array.from({ length: count }).map((_, index) => (
        <MotiView
          key={index}
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 150 }}
        >
          <DiscoverCardSkeleton />
        </MotiView>
      ))}
    </View>
  );
}

export function ChatMessageSkeleton(): React.JSX.Element {
  return (
    <View style={styles.chatMessage}>
      <Skeleton width={40} height={40} borderRadius={20} />
      <View style={styles.chatBubble}>
        <Skeleton width="90%" height={14} borderRadius={6} />
        <View style={{ height: 8 }} />
        <Skeleton width="70%" height={14} borderRadius={6} />
        <View style={{ height: 8 }} />
        <Skeleton width="50%" height={14} borderRadius={6} />
      </View>
    </View>
  );
}

export function ProfileSkeleton(): React.JSX.Element {
  return (
    <View style={styles.profileContainer}>
      <View style={styles.profileHeader}>
        <Skeleton width={140} height={140} borderRadius={70} />
      </View>
      <View style={styles.profileInfo}>
        <Skeleton width={180} height={28} borderRadius={8} />
        <View style={{ height: 12 }} />
        <Skeleton width={220} height={16} borderRadius={6} />
      </View>
      <View style={styles.profileMenu}>
        {Array.from({ length: 4 }).map((_, index) => (
          <MotiView
            key={index}
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: index * 100 }}
          >
            <View style={styles.menuItem}>
              <Skeleton width={56} height={56} borderRadius={28} />
              <View style={styles.menuContent}>
                <Skeleton width={120} height={16} borderRadius={6} />
                <View style={{ height: 6 }} />
                <Skeleton width={160} height={14} borderRadius={6} />
              </View>
            </View>
          </MotiView>
        ))}
      </View>
    </View>
  );
}

export function SearchResultsSkeleton({ count = 5 }: { count?: number }): React.JSX.Element {
  return (
    <View style={styles.searchResults}>
      {Array.from({ length: count }).map((_, index) => (
        <MotiView
          key={index}
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: index * 80 }}
        >
          <View style={styles.searchItem}>
            <Skeleton width={50} height={50} borderRadius={12} />
            <View style={styles.searchContent}>
              <Skeleton width="70%" height={16} borderRadius={6} />
              <View style={{ height: 6 }} />
              <Skeleton width="50%" height={12} borderRadius={4} />
            </View>
          </View>
        </MotiView>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E5E5EA',
  },
  restaurantCard: {
    marginHorizontal: 25,
  },
  listContainer: {
    paddingHorizontal: 25,
    gap: 16,
  },
  rowCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 12,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  rowContent: {
    flex: 1,
    justifyContent: 'center',
  },
  rowInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  discoverCard: {
    marginRight: 18,
  },
  horizontalList: {
    flexDirection: 'row',
    paddingHorizontal: 25,
  },
  chatMessage: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'flex-start',
    gap: 12,
  },
  chatBubble: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderTopLeftRadius: 4,
  },
  profileContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profileMenu: {
    gap: 14,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 22,
    gap: 16,
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
  },
  searchResults: {
    paddingHorizontal: 20,
    gap: 12,
  },
  searchItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    gap: 12,
    alignItems: 'center',
  },
  searchContent: {
    flex: 1,
  },
});

export default Skeleton;
