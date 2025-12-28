// components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', errorInfo.componentStack);

    // Call optional error handler (for Sentry, Bugsnag, etc.)
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <AlertTriangle size={64} color="#FF3B30" />

            <Text style={styles.title}>Something went wrong</Text>

            <Text style={styles.message}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={this.handleRetry}
              accessibilityLabel="Try again"
              accessibilityRole="button"
              accessibilityHint="Attempts to reload this screen"
            >
              <RefreshCw size={20} color="#fff" />
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>

            {/* Debug details toggle (hide in production) */}
            {__DEV__ && (
              <>
                <TouchableOpacity
                  style={styles.detailsToggle}
                  onPress={this.toggleDetails}
                  accessibilityLabel={this.state.showDetails ? 'Hide error details' : 'Show error details'}
                  accessibilityRole="button"
                >
                  <Text style={styles.detailsToggleText}>
                    {this.state.showDetails ? 'Hide Details' : 'Show Details'}
                  </Text>
                  {this.state.showDetails ? (
                    <ChevronUp size={16} color="rgba(255,255,255,0.6)" />
                  ) : (
                    <ChevronDown size={16} color="rgba(255,255,255,0.6)" />
                  )}
                </TouchableOpacity>

                {this.state.showDetails && (
                  <ScrollView style={styles.detailsContainer}>
                    <Text style={styles.detailsTitle}>Error Stack:</Text>
                    <Text style={styles.detailsText}>{this.state.error?.stack}</Text>

                    {this.state.errorInfo && (
                      <>
                        <Text style={styles.detailsTitle}>Component Stack:</Text>
                        <Text style={styles.detailsText}>
                          {this.state.errorInfo.componentStack}
                        </Text>
                      </>
                    )}
                  </ScrollView>
                )}
              </>
            )}
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 32,
    lineHeight: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    minWidth: 160,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 6,
  },
  detailsToggleText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  detailsContainer: {
    maxHeight: 200,
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    width: '100%',
  },
  detailsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF3B30',
    marginBottom: 4,
    marginTop: 8,
  },
  detailsText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'monospace',
  },
});

export default ErrorBoundary;
