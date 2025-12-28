/**
 * Saved Itineraries Context
 * Global state management for saved itineraries
 * - Safe JSON parsing
 * - Rollback on storage failure
 * - O(1) lookup with Set
 */

import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { TripItinerary } from '@/types/itinerary';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { safeJsonParse, safeJsonStringify } from '@/utils/safeJson';

interface SavedItinerary extends TripItinerary {
  savedAt: string;
}

interface SavedItinerariesContextType {
  savedItineraries: SavedItinerary[];
  addSavedItinerary: (itinerary: TripItinerary) => Promise<void>;
  removeSavedItinerary: (itineraryId: string) => Promise<void>;
  isSaved: (itineraryId: string) => boolean;
  loadSavedItineraries: () => Promise<void>;
  getSavedItineraryById: (itineraryId: string) => Promise<SavedItinerary | null>;
  isLoading: boolean;
}

const SavedItinerariesContext = createContext<SavedItinerariesContextType | undefined>(undefined);

const STORAGE_KEY = '@saved_itineraries';

export function SavedItinerariesProvider({ children }: { children: ReactNode }) {
  const [savedItineraries, setSavedItineraries] = useState<SavedItinerary[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // O(1) lookup Set - memoized from savedItineraries array
  const savedIds = useMemo(() => {
    return new Set(savedItineraries.map(item => item.id));
  }, [savedItineraries]);

  // Load saved itineraries from storage
  const loadSavedItineraries = useCallback(async () => {
    setIsLoading(true);
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = safeJsonParse<SavedItinerary[]>(stored, []);
        setSavedItineraries(parsed);
      }
    } catch (error) {
      console.error('Error loading saved itineraries:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addSavedItinerary = useCallback(async (itinerary: TripItinerary) => {
    // Save previous state for rollback
    const previousItineraries = [...savedItineraries];

    const savedItinerary: SavedItinerary = {
      ...itinerary,
      savedAt: new Date().toISOString(),
    };

    const updated = [savedItinerary, ...savedItineraries.filter(item => item.id !== itinerary.id)];

    // Optimistic update
    setSavedItineraries(updated);

    // Persist to storage
    try {
      const jsonString = safeJsonStringify(updated, '[]');
      await AsyncStorage.setItem(STORAGE_KEY, jsonString);
      console.log('✅ Itinerary saved:', itinerary.destination);
    } catch (error) {
      // ROLLBACK on failure
      console.error('Error saving itinerary, rolling back:', error);
      setSavedItineraries(previousItineraries);
      throw error; // Re-throw so caller knows it failed
    }
  }, [savedItineraries]);

  const removeSavedItinerary = useCallback(async (itineraryId: string) => {
    // Save previous state for rollback
    const previousItineraries = [...savedItineraries];

    const updated = savedItineraries.filter(item => item.id !== itineraryId);

    // Optimistic update
    setSavedItineraries(updated);

    // Update storage
    try {
      const jsonString = safeJsonStringify(updated, '[]');
      await AsyncStorage.setItem(STORAGE_KEY, jsonString);
      console.log('🗑️ Itinerary removed from saved');
    } catch (error) {
      // ROLLBACK on failure
      console.error('Error removing saved itinerary, rolling back:', error);
      setSavedItineraries(previousItineraries);
      throw error; // Re-throw so caller knows it failed
    }
  }, [savedItineraries]);

  // O(1) lookup using Set
  const isSaved = useCallback((itineraryId: string) => {
    return savedIds.has(itineraryId);
  }, [savedIds]);

  const getSavedItineraryById = useCallback(async (itineraryId: string): Promise<SavedItinerary | null> => {
    // First check in-memory state
    const found = savedItineraries.find(item => item.id === itineraryId);
    if (found) {
      return found;
    }

    // If not found, check storage
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = safeJsonParse<SavedItinerary[]>(stored, []);
        const storedItem = parsed.find(item => item.id === itineraryId);
        return storedItem || null;
      }
    } catch (error) {
      console.error('Error getting saved itinerary:', error);
    }

    return null;
  }, [savedItineraries]);

  const value = useMemo(() => ({
    savedItineraries,
    addSavedItinerary,
    removeSavedItinerary,
    isSaved,
    loadSavedItineraries,
    getSavedItineraryById,
    isLoading,
  }), [savedItineraries, addSavedItinerary, removeSavedItinerary, isSaved, loadSavedItineraries, getSavedItineraryById, isLoading]);

  return (
    <SavedItinerariesContext.Provider value={value}>
      {children}
    </SavedItinerariesContext.Provider>
  );
}

export function useSavedItineraries() {
  const context = useContext(SavedItinerariesContext);
  if (context === undefined) {
    throw new Error('useSavedItineraries must be used within a SavedItinerariesProvider');
  }
  return context;
}
