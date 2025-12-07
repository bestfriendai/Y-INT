import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export function HomePage({ onNavigateToBrowse, onNavigateToAudio }: any) {
    return (
        <View style={styles.container}>
            <ThemedText type="title">Home</ThemedText>
            <ThemedText>Welcome to the custom glass navbar demo.</ThemedText>
        </View>
    );
}

export function AudioPage() {
    return (
        <View style={styles.container}>
            <ThemedText type="title">Audio</ThemedText>
        </View>
    );
}

export function BrowsePage({ focusSearch }: { focusSearch?: boolean }) {
    return (
        <View style={styles.container}>
            <ThemedText type="title">Browse</ThemedText>
            {focusSearch && <ThemedText>Search Focused!</ThemedText>}
        </View>
    );
}

export function ProfilePage() {
    return (
        <View style={styles.container}>
            <ThemedText type="title">You</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 80,
        paddingHorizontal: 20,
        alignItems: 'center',
        gap: 20,
    }
});
