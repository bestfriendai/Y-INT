/**
 * Cost Estimator Service
 * Compares restaurant options based on calories, quantity, and value
 */

import { YelpService } from './yelpService';
import { Location } from './googleMapsService';
import * as LocationLib from 'expo-location';

export interface CostEstimateOption {
  restaurantName: string;
  restaurantId?: string;
  priceLevel: string; // $, $$, $$$, $$$$
  estimatedCost: number;
  estimatedCalories: number;
  estimatedQuantity: string; // e.g., "2-3 servings", "Large portion"
  valueScore: number; // Calculated score (0-100)
  summary: string;
  categories: string[];
}

export interface CostComparison {
  option1: CostEstimateOption;
  option2: CostEstimateOption;
  budget: number;
  winner: 'option1' | 'option2' | 'tie';
  comparison: {
    betterCalories: 'option1' | 'option2' | 'tie';
    betterQuantity: 'option1' | 'option2' | 'tie';
    betterValue: 'option1' | 'option2' | 'tie';
    personalizedReason: string;
  };
}

export class CostEstimatorService {
  private yelpService: YelpService;

  constructor() {
    this.yelpService = new YelpService();
  }

  /**
   * Estimate cost, calories, and quantity for a restaurant option
   */
  async estimateOption(
    restaurantName: string,
    budget: number,
    location?: Location
  ): Promise<CostEstimateOption | null> {
    try {
      // Get user location if not provided
      if (!location) {
        const { status } = await LocationLib.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const userLocation = await LocationLib.getCurrentPositionAsync({});
          location = {
            lat: userLocation.coords.latitude,
            lng: userLocation.coords.longitude,
          };
        }
      }

      if (!location) {
        return null;
      }

      // Get restaurant data from Yelp
      const business = await this.searchRestaurantByName(restaurantName, location);
      
      if (!business) {
        return null;
      }

      // Get detailed information
      const details = await this.yelpService.getBusinessDetails(business.id);
      const reviews = await this.yelpService.getReviews(business.id);

      // Calculate estimates based on price level, reviews, and categories
      const priceLevel = business.price || '$$';
      const estimatedCost = this.estimateCostFromPriceLevel(priceLevel, budget);
      const estimatedCalories = this.estimateCaloriesFromCategory(
        business.categories,
        reviews,
        priceLevel,
        budget
      );
      const estimatedQuantity = this.estimateQuantityFromReviews(
        reviews,
        business.categories,
        priceLevel
      );

      // Calculate value score (higher is better)
      const valueScore = this.calculateValueScore(
        estimatedCost,
        estimatedCalories,
        estimatedQuantity,
        budget
      );

      // Generate summary from business data
      const summary = this.generateSummary(details, reviews, priceLevel);

      return {
        restaurantName: business.name,
        restaurantId: business.id,
        priceLevel,
        estimatedCost,
        estimatedCalories,
        estimatedQuantity,
        valueScore,
        summary,
        categories: business.categories.map(cat => cat.title),
      };
    } catch (error) {
      console.error('Cost estimation error:', error);
      return null;
    }
  }

  /**
   * Compare two restaurant options
   */
  async compareOptions(
    option1Name: string,
    option2Name: string,
    budget: number,
    location?: Location
  ): Promise<CostComparison | null> {
    const [option1, option2] = await Promise.all([
      this.estimateOption(option1Name, budget, location),
      this.estimateOption(option2Name, budget, location),
    ]);

    if (!option1 || !option2) {
      return null;
    }

    // Determine winner
    let winner: 'option1' | 'option2' | 'tie' = 'tie';
    if (option1.valueScore > option2.valueScore) {
      winner = 'option1';
    } else if (option2.valueScore > option1.valueScore) {
      winner = 'option2';
    }

    // Compare individual metrics
    const betterCalories = 
      option1.estimatedCalories > option2.estimatedCalories ? 'option1' :
      option2.estimatedCalories > option1.estimatedCalories ? 'option2' : 'tie';

    const betterQuantity = 
      this.parseQuantity(option1.estimatedQuantity) > this.parseQuantity(option2.estimatedQuantity) ? 'option1' :
      this.parseQuantity(option2.estimatedQuantity) > this.parseQuantity(option1.estimatedQuantity) ? 'option2' : 'tie';

    const betterValue = winner;

    // Generate personalized reason
    const personalizedReason = this.generatePersonalizedReason(
      option1,
      option2,
      betterCalories,
      betterQuantity,
      betterValue,
      budget
    );

    return {
      option1,
      option2,
      budget,
      winner,
      comparison: {
        betterCalories,
        betterQuantity,
        betterValue,
        personalizedReason,
      },
    };
  }

  /**
   * Search for restaurant by name
   */
  private async searchRestaurantByName(name: string, location: Location): Promise<any> {
    try {
      // Use searchRestaurants with the restaurant name as search term
      const restaurants = await this.yelpService.searchRestaurants(location.lat, location.lng, name, 1);
      return restaurants[0] || null;
    } catch (error) {
      console.error('Error searching restaurant:', error);
      return null;
    }
  }

  /**
   * Estimate cost from price level
   */
  private estimateCostFromPriceLevel(priceLevel: string, budget: number): number {
    // Price levels: $ (cheap), $$ (moderate), $$$ (expensive), $$$$ (very expensive)
    const priceMultipliers: { [key: string]: number } = {
      '$': 0.6,      // Use 60% of budget
      '$$': 0.8,     // Use 80% of budget
      '$$$': 0.95,   // Use 95% of budget
      '$$$$': 1.1,   // Might exceed budget
    };

    const multiplier = priceMultipliers[priceLevel] || 0.8;
    return Math.min(budget * multiplier, budget * 1.1);
  }

  /**
   * Estimate calories from category and reviews
   */
  private estimateCaloriesFromCategory(
    categories: Array<{ alias: string; title: string }>,
    reviews: any[],
    priceLevel: string,
    budget: number
  ): number {
    // Base calories by category
    const categoryCalories: { [key: string]: number } = {
      'pizza': 800,
      'italian': 900,
      'burgers': 1000,
      'american': 950,
      'mexican': 850,
      'asian': 700,
      'chinese': 750,
      'japanese': 650,
      'indian': 800,
      'thai': 700,
      'seafood': 600,
      'mediterranean': 750,
      'fast food': 1100,
      'sandwiches': 700,
      'salad': 400,
    };

    // Find matching category
    const categoryTitles = categories.map(c => c.title.toLowerCase());
    let baseCalories = 700; // Default

    for (const [key, calories] of Object.entries(categoryCalories)) {
      if (categoryTitles.some(ct => ct.includes(key))) {
        baseCalories = calories;
        break;
      }
    }

    // Adjust based on price level (more expensive usually means more/better food)
    const priceAdjustment: { [key: string]: number } = {
      '$': 0.9,
      '$$': 1.0,
      '$$$': 1.2,
      '$$$$': 1.4,
    };

    const adjustment = priceAdjustment[priceLevel] || 1.0;
    let calories = baseCalories * adjustment;

    // Adjust based on budget (more budget = more food)
    calories = calories * (budget / 25); // Normalize to $25 baseline

    // Review-based adjustments (look for portion size mentions)
    const reviewText = reviews.map(r => r.text.toLowerCase()).join(' ');
    if (reviewText.includes('large') || reviewText.includes('big') || reviewText.includes('huge')) {
      calories *= 1.3;
    } else if (reviewText.includes('small') || reviewText.includes('tiny')) {
      calories *= 0.8;
    }

    return Math.round(calories);
  }

  /**
   * Estimate quantity from reviews
   */
  private estimateQuantityFromReviews(
    reviews: any[],
    categories: Array<{ alias: string; title: string }>,
    priceLevel: string
  ): string {
    const reviewText = reviews.map(r => r.text.toLowerCase()).join(' ');
    
    // Look for quantity indicators in reviews
    if (reviewText.includes('share') || reviewText.includes('splitting')) {
      return '2-3 servings (sharable)';
    }
    
    if (reviewText.includes('large') || reviewText.includes('big') || reviewText.includes('huge')) {
      return 'Large portion (1-2 servings)';
    }
    
    if (reviewText.includes('small') || reviewText.includes('tiny') || reviewText.includes('little')) {
      return 'Single serving';
    }

    // Default based on price level
    const quantityByPrice: { [key: string]: string } = {
      '$': 'Single serving',
      '$$': '1-2 servings',
      '$$$': '2-3 servings',
      '$$$$': '2-3 servings (premium)',
    };

    return quantityByPrice[priceLevel] || '1-2 servings';
  }

  /**
   * Calculate value score (0-100)
   */
  private calculateValueScore(
    cost: number,
    calories: number,
    quantity: string,
    budget: number
  ): number {
    // Cost efficiency (lower cost relative to budget = better)
    const costEfficiency = (budget - cost) / budget * 40; // 40 points max

    // Calorie value (more calories per dollar = better)
    const calorieValue = (calories / cost) * 30; // 30 points max, normalize

    // Quantity value (larger servings = better)
    const quantityValue = this.parseQuantity(quantity) * 30; // 30 points max

    // Normalize and cap scores
    const score = Math.min(100, costEfficiency + Math.min(calorieValue, 30) + Math.min(quantityValue, 30));
    return Math.round(score);
  }

  /**
   * Parse quantity string to numeric value
   */
  private parseQuantity(quantity: string): number {
    if (quantity.includes('3')) return 3;
    if (quantity.includes('2')) return 2;
    if (quantity.includes('large') || quantity.includes('big')) return 2.5;
    return 1;
  }

  /**
   * Generate business summary
   */
  private generateSummary(details: any, reviews: any[], priceLevel: string): string {
    const rating = details.rating || 0;
    const reviewCount = details.review_count || 0;
    const categories = details.categories?.map((cat: any) => cat.title).join(', ') || 'Restaurant';
    
    return `${details.name} (${priceLevel}) - ${categories} with ${rating}⭐ from ${reviewCount} reviews. ${
      reviews.length > 0 ? reviews[0].text.slice(0, 100) + '...' : 'Well-rated establishment.'
    }`;
  }

  /**
   * Generate personalized comparison reason
   */
  private generatePersonalizedReason(
    option1: CostEstimateOption,
    option2: CostEstimateOption,
    betterCalories: string,
    betterQuantity: string,
    betterValue: string,
    budget: number
  ): string {
    const winner = betterValue === 'option1' ? option1 : option2;
    const loser = betterValue === 'option1' ? option2 : option1;
    const winnerName = winner.restaurantName;
    const loserName = loser.restaurantName;

    let reason = `${winnerName} offers the best value for your $${budget} budget.\n\n`;

    // Calories comparison
    if (betterCalories !== 'tie') {
      const calorieWinner = betterCalories === 'option1' ? option1 : option2;
      const calorieLoser = betterCalories === 'option1' ? option2 : option1;
      reason += `• More Calories: ${calorieWinner.restaurantName} provides ${calorieWinner.estimatedCalories} calories vs ${calorieLoser.estimatedCalories} calories (${calorieWinner.estimatedCalories - calorieLoser.estimatedCalories} more).\n\n`;
    }

    // Quantity comparison
    if (betterQuantity !== 'tie') {
      const quantityWinner = betterQuantity === 'option1' ? option1 : option2;
      const quantityLoser = betterQuantity === 'option1' ? option2 : option1;
      reason += `• Better Portion Size: ${quantityWinner.restaurantName} offers "${quantityWinner.estimatedQuantity}" compared to "${quantityLoser.estimatedQuantity}" from ${quantityLoser.restaurantName}.\n\n`;
    }

    // Cost efficiency
    const costDiff = Math.abs(option1.estimatedCost - option2.estimatedCost);
    if (costDiff > 2) {
      const cheaper = option1.estimatedCost < option2.estimatedCost ? option1 : option2;
      const expensive = option1.estimatedCost < option2.estimatedCost ? option2 : option1;
      reason += `• Cost Savings: ${cheaper.restaurantName} costs $${cheaper.estimatedCost.toFixed(2)}, saving you $${costDiff.toFixed(2)} compared to ${expensive.restaurantName} ($${expensive.estimatedCost.toFixed(2)}).\n\n`;
    }

    // Overall recommendation
    reason += `Recommendation: Choose ${winnerName} for the best combination of calories, quantity, and value within your budget!`;

    return reason;
  }
}
