import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '@/components/LucideIcons';
import { MotiView, MotiText } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Sample resort data - can be replaced with real API data
const RESORTS = [
    {
        id: '1',
        name: 'Four Seasons Resort',
        location: 'South Maldives',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=2670&auto=format&fit=crop',
    },
    {
        id: '2',
        name: 'The Ritz Carlton',
        location: 'Maldives',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2670&auto=format&fit=crop',
    },
    {
        id: '3',
        name: 'Anantara Resort',
        location: 'Bora Bora',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2670&auto=format&fit=crop',
    },
];

// Sample places nearby - can be replaced with real API data
const PLACES_NEARBY = [
    {
        id: '1',
        name: 'Addu Atoll',
        location: 'South Maldives',
        rating: 4.7,
        reviews: 3800,
        distance: '2km away',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2670&auto=format&fit=crop',
    },
    {
        id: '2',
        name: 'Fulhadhoo',
        location: 'South Maldives',
        rating: 4.6,
        reviews: 2700,
        distance: '2.6km away',
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2670&auto=format&fit=crop',
    },
    {
        id: '3',
        name: 'Vaadhoo Island',
        location: 'Central Maldives',
        rating: 4.8,
        reviews: 4200,
        distance: '3.2km away',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        id: '4',
        name: 'Biyadhoo Island',
        location: 'South Male Atoll',
        rating: 4.5,
        reviews: 1900,
        distance: '4.8km away',
        image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?q=80&w=2670&auto=format&fit=crop',
    },
];

export default function ExplorePage() {
    const router = useRouter();
    const [savedPlaces, setSavedPlaces] = useState<Set<string>>(new Set());

    const toggleSave = (id: string) => {
        setSavedPlaces(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <MotiView
                    from={{ opacity: 0, translateY: -20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 700 }}
                    style={styles.header}
                >
                    <MotiText style={styles.exploreTitle}>Explore</MotiText>
                </MotiView>

                {/* Explore Resorts Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <MotiText
                            style={styles.sectionTitle}
                            from={{ opacity: 0, translateX: -20 }}
                            animate={{ opacity: 1, translateX: 0 }}
                            transition={{ duration: 500, delay: 200 }}
                        >
                            Discover
                        </MotiText>
                        <TouchableOpacity>
                            <MotiText style={styles.seeAllText}>See All</MotiText>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={RESORTS}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.resortsList}
                        renderItem={({ item, index }) => (
                            <MotiView
                                from={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', delay: 300 + (index * 150) }}
                            >
                                <TouchableOpacity
                                    style={styles.resortCard}
                                    activeOpacity={0.9}
                                >
                                    <Image source={{ uri: item.image }} style={styles.resortImage} />
                                    
                                    {/* Gradient Overlay */}
                                    <LinearGradient
                                        colors={['transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)']}
                                        style={styles.resortGradient}
                                    />

                                    {/* Rating Badge */}
                                    <View style={styles.ratingBadge}>
                                        <Icon name="Star" size={14} color="#FFD700" fill="#FFD700" />
                                        <MotiText style={styles.ratingText}>{item.rating}</MotiText>
                                    </View>

                                    {/* Bookmark Icon */}
                                    <TouchableOpacity
                                        style={styles.bookmarkButton}
                                        onPress={() => toggleSave(item.id)}
                                    >
                                        <Icon
                                            name="Bookmark"
                                            size={20}
                                            color="white"
                                            fill={savedPlaces.has(item.id) ? 'white' : 'transparent'}
                                        />
                                    </TouchableOpacity>

                                    {/* Resort Info */}
                                    <View style={styles.resortInfo}>
                                        <MotiText style={styles.resortName}>{item.name}</MotiText>
                                        <View style={styles.resortLocationRow}>
                                            <Icon name="MapPin" size={12} color="rgba(255,255,255,0.8)" />
                                            <MotiText style={styles.resortLocation}>{item.location}</MotiText>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </MotiView>
                        )}
                        keyExtractor={item => item.id}
                    />
                </View>

                {/* Places Near You Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <MotiText
                            style={styles.sectionTitle}
                            from={{ opacity: 0, translateX: -20 }}
                            animate={{ opacity: 1, translateX: 0 }}
                            transition={{ duration: 500, delay: 500 }}
                        >
                            Places near you
                        </MotiText>
                        <TouchableOpacity>
                            <MotiText style={styles.seeAllText}>See All</MotiText>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.placesList}>
                        {PLACES_NEARBY.map((place, index) => (
                            <MotiView
                                key={place.id}
                                from={{ opacity: 0, translateX: -30 }}
                                animate={{ opacity: 1, translateX: 0 }}
                                transition={{ type: 'spring', delay: 600 + (index * 100) }}
                            >
                                <TouchableOpacity
                                    style={styles.placeCard}
                                    activeOpacity={0.7}
                                >
                                    <Image source={{ uri: place.image }} style={styles.placeImage} />
                                    
                                    <View style={styles.placeInfo}>
                                        <MotiText style={styles.placeName}>{place.name}</MotiText>
                                        <View style={styles.placeLocationRow}>
                                            <Icon name="MapPin" size={12} color="#8E8E93" />
                                            <MotiText style={styles.placeLocation}>{place.location}</MotiText>
                                        </View>
                                        <View style={styles.placeDetailsRow}>
                                            <View style={styles.placeRating}>
                                                <Icon name="Star" size={12} color="#FFD700" fill="#FFD700" />
                                                <MotiText style={styles.placeRatingText}>{place.rating}</MotiText>
                                                <MotiText style={styles.placeReviews}>({place.reviews.toLocaleString()} Reviews)</MotiText>
                                            </View>
                                            <MotiText style={styles.placeDistance}>{place.distance}</MotiText>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </MotiView>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },
    scrollContent: {
        paddingBottom: 120,
    },
    header: {
        paddingHorizontal: 25,
        marginTop: 10,
        marginBottom: 30,
    },
    exploreTitle: {
        fontSize: 36,
        fontWeight: '800',
        color: '#1A1A1A',
        letterSpacing: -1,
    },
    section: {
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        marginBottom: 18,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        letterSpacing: -0.5,
    },
    seeAllText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FA6868',
    },
    resortsList: {
        paddingHorizontal: 25,
        gap: 18,
    },
    resortCard: {
        width: width * 0.6,
        height: 240,
        borderRadius: 25,
        overflow: 'hidden',
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8,
    },
    resortImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    resortGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '50%',
    },
    ratingBadge: {
        position: 'absolute',
        top: 14,
        left: 14,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    bookmarkButton: {
        position: 'absolute',
        top: 14,
        right: 14,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    resortInfo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
    },
    resortName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    resortLocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    resortLocation: {
        fontSize: 13,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.85)',
    },
    placesList: {
        paddingHorizontal: 25,
        gap: 16,
    },
    placeCard: {
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
    placeImage: {
        width: 85,
        height: 85,
        borderRadius: 16,
    },
    placeInfo: {
        flex: 1,
        justifyContent: 'center',
        gap: 6,
    },
    placeName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
        letterSpacing: -0.3,
    },
    placeLocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    placeLocation: {
        fontSize: 13,
        fontWeight: '500',
        color: '#8E8E93',
    },
    placeDetailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    placeRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    placeRatingText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    placeReviews: {
        fontSize: 12,
        fontWeight: '500',
        color: '#8E8E93',
    },
    placeDistance: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8E8E93',
    },
});
