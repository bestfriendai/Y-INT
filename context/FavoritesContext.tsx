/**
 * Favorites Context
 * Global state management for favorite restaurants
 * - Safe JSON parsing
 * - Rollback on storage failure
 * - O(1) lookup with Set
 */

import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { RecognitionOutput } from '@/services/cameraRecognitionEngine';
import { YelpBusiness } from '@/services/yelpService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { safeJsonParse, safeJsonStringify } from '@/utils/safeJson';

interface FavoriteRestaurant {
  savedAt: string;
  restaurantId: string;
  // Can be either RecognitionOutput or converted YelpBusiness format
  google_match?: {
    name: string;
    address?: string;
    rating?: number;
    images?: string[];
    phone?: string;
    website?: string;
    location?: { lat: number; lng: number };
  };
  yelp_ai?: {
    summary?: string;
    review_highlights?: string;
    popular_dishes?: string[];
    categories?: string[];
    yelp_rating?: number;
    review_count?: number;
  };
  personalization?: {
    match_score?: number;
    match_reasons?: string[];
    personalized_recommendations?: string[];
  };
  // For YelpBusiness format
  name?: string;
  image_url?: string;
  rating?: number;
  review_count?: number;
  location?: {
    address1?: string;
    city?: string;
    state?: string;
  };
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };
  categories?: Array<{ title: string }>;
  phone?: string;
  price?: string;
}

interface FavoritesContextType {
  favorites: FavoriteRestaurant[];
  addFavorite: (restaurant: RecognitionOutput | YelpBusiness, restaurantId: string) => Promise<void>;
  removeFavorite: (restaurantId: string) => Promise<void>;
  isFavorite: (restaurantId: string) => boolean;
  loadFavorites: () => Promise<void>;
  isLoading: boolean;
}

const STORAGE_KEY = '@favorite_restaurants';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // O(1) lookup Set - memoized from favorites array
  const favoriteIds = useMemo(() => {
    return new Set(favorites.map(fav => fav.restaurantId));
  }, [favorites]);

  // Load favorites from storage
  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = safeJsonParse<FavoriteRestaurant[]>(stored, []);
        setFavorites(parsed);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addFavorite = useCallback(async (restaurant: RecognitionOutput | YelpBusiness, restaurantId: string) => {
    // Save previous state for rollback
    const previousFavorites = [...favorites];

    let newFavorite: FavoriteRestaurant;

    // Check if it's a YelpBusiness (has image_url property)
    if ('image_url' in restaurant) {
      const yelpRestaurant = restaurant as YelpBusiness;
      newFavorite = {
        savedAt: new Date().toISOString(),
        restaurantId,
        name: yelpRestaurant.name,
        image_url: yelpRestaurant.image_url,
        rating: yelpRestaurant.rating,
        review_count: yelpRestaurant.review_count,
        location: yelpRestaurant.location,
        coordinates: yelpRestaurant.coordinates,
        categories: yelpRestaurant.categories,
        phone: yelpRestaurant.phone,
        price: yelpRestaurant.price,
        google_match: {
          name: yelpRestaurant.name,
          address: `${yelpRestaurant.location?.address1 || ''}, ${yelpRestaurant.location?.city || ''}, ${yelpRestaurant.location?.state || ''}`,
          rating: yelpRestaurant.rating,
          images: yelpRestaurant.image_url ? [yelpRestaurant.image_url] : [],
          phone: yelpRestaurant.phone,
          location: yelpRestaurant.coordinates ? {
            lat: yelpRestaurant.coordinates.latitude || 0,
            lng: yelpRestaurant.coordinates.longitude || 0,
          } : undefined,
        },
        yelp_ai: {
          categories: yelpRestaurant.categories?.map(c => c.title) || [],
          yelp_rating: yelpRestaurant.rating,
          review_count: yelpRestaurant.review_count,
        },
      };
    } else {
      // It's a RecognitionOutput
      const recognitionOutput = restaurant as RecognitionOutput;
      newFavorite = {
        ...recognitionOutput,
        savedAt: new Date().toISOString(),
        restaurantId,
      };
    }

    const updated = [newFavorite, ...favorites.filter(fav => fav.restaurantId !== restaurantId)];

    // Optimistic update
    setFavorites(updated);

    // Persist to storage
    try {
      const jsonString = safeJsonStringify(updated, '[]');
      await AsyncStorage.setItem(STORAGE_KEY, jsonString);
      console.log('❤️ Added to favorites:', newFavorite.google_match?.name || newFavorite.name);
    } catch (error) {
      // ROLLBACK on failure
      console.error('Error saving favorites, rolling back:', error);
      setFavorites(previousFavorites);
      throw error; // Re-throw so caller knows it failed
    }
  }, [favorites]);

  const removeFavorite = useCallback(async (restaurantId: string) => {
    // Save previous state for rollback
    const previousFavorites = [...favorites];

    const updated = favorites.filter(fav => fav.restaurantId !== restaurantId);

    // Optimistic update
    setFavorites(updated);

    // Update storage
    try {
      const jsonString = safeJsonStringify(updated, '[]');
      await AsyncStorage.setItem(STORAGE_KEY, jsonString);
      console.log('💔 Removed from favorites');
    } catch (error) {
      // ROLLBACK on failure
      console.error('Error removing favorite, rolling back:', error);
      setFavorites(previousFavorites);
      throw error; // Re-throw so caller knows it failed
    }
  }, [favorites]);

  // O(1) lookup using Set
  const isFavorite = useCallback((restaurantId: string) => {
    return favoriteIds.has(restaurantId);
  }, [favoriteIds]);

  const value = useMemo(() => ({
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    loadFavorites,
    isLoading,
  }), [favorites, addFavorite, removeFavorite, isFavorite, loadFavorites, isLoading]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
