/**
 * Camera Recognition Engine
 * Orchestrates OCR → Google Maps → Yelp AI → Supabase pipeline
 */

import { GoogleVisionService } from './googleVisionService';
import { GoogleMapsService, Location } from './googleMapsService';
import { YelpService } from './yelpService';
import { SupabaseService, UserPreferences } from './supabaseService';

export interface RecognitionInput {
  frame_id: string;
  camera_image_base64: string;
  gps: Location;
  supabase_user: {
    user_id: string;
    favorites: string[];
    dietary_preferences: string[];
    past_visits: Array<{
      place_id: string;
      name: string;
      visited_at: string;
    }>;
    liked_cuisines: string[];
  };
}

export interface RecognitionOutput {
  ocr_text: string;
  google_match: {
    name: string;
    address: string;
    rating: string;
    price_level: string;
    opening_hours: string;
    contact: string;
    images: string[];
  };
  yelp_ai: {
    summary: string;
    review_highlights: string;
    popular_dishes: string[];
    menu_items: Array<{
      name: string;
      description: string;
      price: string;
    }>;
    dietary_labels: string[];
    photos: string[];
  };
  personalization: {
    is_favorite: boolean;
    cuisine_match_score: number;
    user_diet_match: string;
    personalized_recommendations: string[];
  };
  confidence_score: number;
}

export class CameraRecognitionEngine {
  private visionService: GoogleVisionService;
  private mapsService: GoogleMapsService;
  private yelpService: YelpService;
  private supabaseService: SupabaseService;

  constructor() {
    this.visionService = new GoogleVisionService();
    this.mapsService = new GoogleMapsService();
    this.yelpService = new YelpService();
    this.supabaseService = new SupabaseService();
  }

  /**
   * Main processing pipeline - Optimized Flow
   * 1. Extract text from image (OCR)
   * 2. Get geolocation
   * 3. Match OCR + GPS to find exact restaurant
   * 4. Send to Yelp for detailed information
   * Returns strict JSON only
   */
  async processFrame(input: RecognitionInput): Promise<RecognitionOutput> {
    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🎯 AR RECOGNITION PIPELINE STARTED');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // STEP 1: OCR - Extract text from camera image FIRST
      console.log('\n📸 STEP 1: Image Analysis (Google Vision OCR)');
      console.log('   Processing image...');
      const ocrResult = await this.visionService.extractText(input.camera_image_base64);
      
      if (!ocrResult.restaurantNameCandidates.length) {
        console.log('   ❌ No text detected in image');
        return this.createEmptyResponse('No text detected in image');
      }
      
      console.log('   ✅ OCR Complete!');
      console.log('   📝 Extracted text:', ocrResult.fullText.slice(0, 100) + '...');
      console.log('   🎯 Restaurant candidates:', ocrResult.restaurantNameCandidates);

      // STEP 2: Fetch Geolocation (already have it from input)
      console.log('\n📍 STEP 2: Geolocation');
      console.log('   GPS Coordinates:', input.gps);
      console.log('   Ready to match with nearby restaurants');

      // STEP 3: Match OCR + GPS - Find exact restaurant
      console.log('\n🗺️ STEP 3: Restaurant Identification (Google Maps Places)');
      console.log('   Matching OCR text with GPS location...');
      const googleMatch = await this.mapsService.findRestaurant(
        ocrResult.restaurantNameCandidates,
        input.gps
      );

      if (!googleMatch) {
        console.log('   ❌ No restaurant match found');
        console.log('   💡 Try getting closer or pointing at clearer signage');
        return this.createEmptyResponse('No restaurant found nearby', ocrResult.fullText);
      }

      console.log('   ✅ Restaurant Identified!');
      console.log('   🏪 Name:', googleMatch.name);
      console.log('   📍 Address:', googleMatch.address);
      console.log('   ⭐ Rating:', googleMatch.rating);

      // STEP 4: Send to Yelp - Get detailed restaurant information
      console.log('\n🍽️ STEP 4: Fetching Restaurant Details (Yelp API)');
      console.log('   Sending to Yelp:', googleMatch.name);
      console.log('   Location:', googleMatch.geometry.location);
      
      const yelpData = await this.yelpService.getRestaurantIntelligence(
        googleMatch.name,
        googleMatch.geometry.location
      );

      if (yelpData) {
        console.log('   ✅ Yelp Data Retrieved!');
        console.log('   📊 Reviews:', yelpData.review_count);
        console.log('   🍕 Popular dishes:', yelpData.popular_dishes.length);
        console.log('   🥗 Dietary labels:', yelpData.dietary_labels.length);
      } else {
        console.log('   ⚠️ Yelp data not available (will use Google data only)');
      }

      // STEP 5: Supabase - Add personalization
      console.log('\n👤 STEP 5: Personalizing with user data...');
      const personalization = this.supabaseService.calculatePersonalization(
        input.supabase_user as UserPreferences,
        {
          place_id: googleMatch.place_id,
          categories: yelpData?.categories || [],
          dietary_labels: yelpData?.dietary_labels || [],
          popular_dishes: yelpData?.popular_dishes || [],
        }
      );

      // Calculate confidence score
      const confidence_score = this.calculateConfidence(
        ocrResult.confidence,
        googleMatch,
        yelpData
      );

      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ RECOGNITION COMPLETE!');
      console.log(`   Restaurant: ${googleMatch.name}`);
      console.log(`   Confidence: ${(confidence_score * 100).toFixed(0)}%`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      // STEP 6: Return unified JSON
      return {
        ocr_text: ocrResult.fullText,
        google_match: {
          name: googleMatch.name,
          address: googleMatch.address,
          rating: googleMatch.rating.toString(),
          price_level: '$'.repeat(googleMatch.price_level || 2),
          opening_hours: googleMatch.opening_hours,
          contact: googleMatch.contact,
          images: googleMatch.images,
        },
        yelp_ai: {
          summary: yelpData?.summary || '',
          review_highlights: yelpData?.review_highlights || '',
          popular_dishes: yelpData?.popular_dishes || [],
          menu_items: yelpData?.menu_items || [],
          dietary_labels: yelpData?.dietary_labels || [],
          photos: yelpData?.photos || [],
        },
        personalization,
        confidence_score,
      };
    } catch (error) {
      console.error('\n❌ RECOGNITION PIPELINE ERROR:', error);
      return this.createEmptyResponse('Processing error occurred');
    }
  }

  /**
   * Calculate overall confidence score
   */
  private calculateConfidence(
    ocrConfidence: number,
    googleMatch: any,
    yelpData: any
  ): number {
    let score = 0;

    // OCR confidence (30%)
    score += ocrConfidence * 0.3;

    // Google Maps match quality (40%)
    if (googleMatch.rating > 0) score += 0.2;
    if (googleMatch.images.length > 0) score += 0.2;

    // Yelp data availability (30%)
    if (yelpData) {
      score += 0.15;
      if (yelpData.popular_dishes.length > 0) score += 0.15;
    }

    return Math.min(Math.round(score * 100) / 100, 1.0);
  }

  /**
   * Create empty/error response
   */
  private createEmptyResponse(reason: string, ocrText: string = ''): RecognitionOutput {
    console.log(`⚠️ ${reason}`);
    
    return {
      ocr_text: ocrText,
      google_match: {
        name: '',
        address: '',
        rating: '',
        price_level: '',
        opening_hours: '',
        contact: '',
        images: [],
      },
      yelp_ai: {
        summary: '',
        review_highlights: '',
        popular_dishes: [],
        menu_items: [],
        dietary_labels: [],
        photos: [],
      },
      personalization: {
        is_favorite: false,
        cuisine_match_score: 0,
        user_diet_match: '',
        personalized_recommendations: [],
      },
      confidence_score: 0.0,
    };
  }
}

