import Icon from '@/components/LucideIcons';
import { ThemedText } from '@/components/themed-text';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function ProfilePage() {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#f12711', '#f5af19']}
                style={styles.background}
            />
            <View style={styles.content}>
                <Icon name="User" size={48} color="white" />
                <ThemedText type="title" style={styles.text}>Profile</ThemedText>
                <ThemedText style={styles.subtext}>Manage your account.</ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    content: {
        alignItems: 'center',
        gap: 10,
    },
    text: {
        color: 'white',
    },
    subtext: {
        color: 'rgba(255,255,255,0.8)',
    }
});
