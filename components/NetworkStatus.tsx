/**
 * Network Status Indicator Component
 * Shows connectivity status to users
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import Icon from '@/components/LucideIcons';

interface NetworkStatusProps {
  showWhenOnline?: boolean;
}

export function NetworkStatus({ showWhenOnline = false }: NetworkStatusProps): React.JSX.Element | null {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [connectionType, setConnectionType] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });

    return () => unsubscribe();
  }, []);

  // Don't render if connected and showWhenOnline is false
  if (isConnected && !showWhenOnline) {
    return null;
  }

  return (
    <AnimatePresence>
      {!isConnected && (
        <MotiView
          from={{ opacity: 0, translateY: -50 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -50 }}
          transition={{ type: 'spring', damping: 20 }}
          style={styles.offlineContainer}
        >
          <View style={styles.offlineContent}>
            <Icon name="WifiOff" size={18} color="#FFF" />
            <Text style={styles.offlineText}>No Internet Connection</Text>
          </View>
        </MotiView>
      )}
      {isConnected && showWhenOnline && (
        <MotiView
          from={{ opacity: 0, translateY: -50 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -50 }}
          transition={{ type: 'spring', damping: 20 }}
          style={styles.onlineContainer}
        >
          <View style={styles.onlineContent}>
            <Icon name="Wifi" size={18} color="#FFF" />
            <Text style={styles.onlineText}>Connected</Text>
          </View>
        </MotiView>
      )}
    </AnimatePresence>
  );
}

// Hook for checking network status
export function useNetworkStatus(): { isConnected: boolean | null; connectionType: string | null } {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [connectionType, setConnectionType] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });

    return () => unsubscribe();
  }, []);

  return { isConnected, connectionType };
}

const styles = StyleSheet.create({
  offlineContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    right: 20,
    zIndex: 9998,
  },
  offlineContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  offlineText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  onlineContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    right: 20,
    zIndex: 9998,
  },
  onlineContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  onlineText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NetworkStatus;
