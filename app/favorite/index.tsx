import Icon from '@/components/LucideIcons';
import { ThemedText } from '@/components/themed-text';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function FavoritePage() {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#11998e', '#38ef7d']}
                style={styles.background}
            />
            <View style={styles.content}>
                <Icon name="Heart" size={48} color="white" />
                <ThemedText type="title" style={styles.text}>Favorites</ThemedText>
                <ThemedText style={styles.subtext}>Your saved items.</ThemedText>
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
