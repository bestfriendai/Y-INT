// config/env.ts
// Centralized environment configuration with validation
import Constants from 'expo-constants';

export interface Environment {
  YELP_API_KEY: string;
  GOOGLE_VISION_API_KEY: string;
  GOOGLE_MAPS_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  REVENUECAT_IOS_KEY: string;
  REVENUECAT_ANDROID_KEY: string;
}

const validateEnvVar = (name: string, value: string | undefined): string => {
  if (!value || value.trim() === '') {
    console.warn(`⚠️ Environment variable ${name} is not set`);
    return '';
  }
  return value;
};

const getEnvVars = (): Environment => {
  const extra = Constants.expoConfig?.extra;

  // In development, we can use fallbacks or warn
  // In production, these should all be set via app.json or eas.json

  return {
    YELP_API_KEY: validateEnvVar(
      'YELP_API_KEY',
      extra?.YELP_API_KEY || process.env.EXPO_PUBLIC_YELP_API_KEY
    ),
    GOOGLE_VISION_API_KEY: validateEnvVar(
      'GOOGLE_VISION_API_KEY',
      extra?.GOOGLE_VISION_API_KEY || process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY
    ),
    GOOGLE_MAPS_API_KEY: validateEnvVar(
      'GOOGLE_MAPS_API_KEY',
      extra?.GOOGLE_MAPS_API_KEY || process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
    ),
    SUPABASE_URL: validateEnvVar(
      'SUPABASE_URL',
      extra?.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL
    ),
    SUPABASE_ANON_KEY: validateEnvVar(
      'SUPABASE_ANON_KEY',
      extra?.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    ),
    REVENUECAT_IOS_KEY: validateEnvVar(
      'REVENUECAT_IOS_KEY',
      extra?.REVENUECAT_IOS_KEY || process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY
    ),
    REVENUECAT_ANDROID_KEY: validateEnvVar(
      'REVENUECAT_ANDROID_KEY',
      extra?.REVENUECAT_ANDROID_KEY || process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY
    ),
  };
};

export const ENV = getEnvVars();

// Helper to check if all required env vars are set
export const validateEnvironment = (): { isValid: boolean; missing: string[] } => {
  const required = ['YELP_API_KEY', 'GOOGLE_MAPS_API_KEY', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  const missing = required.filter((key) => !ENV[key as keyof Environment]);

  return {
    isValid: missing.length === 0,
    missing,
  };
};
