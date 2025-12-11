import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MotiView, MotiText } from 'moti';
import Icon from '@/components/LucideIcons';
import { useSavedItineraries } from '@/context/SavedItinerariesContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfilePage() {
  const router = useRouter();
  const { savedItineraries, loadSavedItineraries, removeSavedItinerary } = useSavedItineraries();
  const [showSavedItineraries, setShowSavedItineraries] = useState(false);

  useEffect(() => {
    loadSavedItineraries();
  }, []);

  const menuItems = [
    {
      id: 'username',
      icon: 'User',
      iconColor: '#A78BFA',
      title: 'Username',
      subtitle: '@anishganapathi',
      onPress: () => console.log('Username'),
    },
    {
      id: 'notifications',
      icon: 'Bell',
      iconColor: '#60D5FA',
      title: 'Notifications',
      subtitle: 'Mute, Push, Email',
      onPress: () => console.log('Notifications'),
    },
    {
      id: 'Saved',
      icon: 'Save',
      iconColor: '#FA6868',
      title: 'Saved',
      subtitle: `${savedItineraries.length} saved ${savedItineraries.length === 1 ? 'itinerary' : 'itineraries'}`,
      onPress: () => setShowSavedItineraries(!showSavedItineraries),
    },
    {
        id: 'settings',
        icon: 'Settings',
        iconColor: '#86EFAC',
        title: 'Settings',
        subtitle: 'Security, Privacy',
        onPress: () => console.log('Settings'),
      },
  ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 700 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <Icon name="Settings" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <Icon name="Share2" size={22} color="#1A1A1A" />
        </TouchableOpacity>
      </MotiView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Avatar */}
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', delay: 100 }}
          style={styles.avatarContainer}
        >
          <View style={styles.avatarWrapper}>
            <Image
              source={require('@/assets/images/avatar.png')}
              style={styles.avatar}
            />
          </View>
        </MotiView>

        {/* Name & Email */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', delay: 200 }}
          style={styles.infoContainer}
        >
          <Text style={styles.name}>Anish Ganapathi</Text>
          <Text style={styles.email}>anishgnapathi@gmail.com</Text>
        </MotiView>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <MotiView
              key={item.id}
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'spring', delay: 500 + index * 100 }}
            >
              <TouchableOpacity
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconContainer, { backgroundColor: `${item.iconColor}20` }]}>
                    <Icon name={item.icon} size={22} color={item.iconColor} />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>
            </View>
                <Icon 
                  name={item.id === 'Saved' && showSavedItineraries ? "ChevronUp" : "ChevronRight"} 
                  size={24} 
                  color="#C7C7CC" 
                />
              </TouchableOpacity>
            </MotiView>
          ))}
        </View>

        {/* Saved Itineraries Section */}
        {showSavedItineraries && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring' }}
            style={styles.savedSection}
          >
            <View style={styles.savedSectionHeader}>
              <Text style={styles.savedSectionTitle}>Saved Itineraries</Text>
              <Text style={styles.savedSectionSubtitle}>{savedItineraries.length} {savedItineraries.length === 1 ? 'trip' : 'trips'} saved</Text>
            </View>

            {savedItineraries.length === 0 ? (
              <View style={styles.emptySavedContainer}>
                <Icon name="MapPin" size={48} color="#C7C7CC" />
                <Text style={styles.emptySavedText}>No saved itineraries yet</Text>
                <Text style={styles.emptySavedSubtext}>Save an itinerary to see it here</Text>
              </View>
            ) : (
              <View style={styles.savedItinerariesList}>
                {savedItineraries.map((itinerary, index) => {
                  const startDate = new Date(itinerary.startDate);
                  const endDate = new Date(itinerary.endDate);
                  const totalMeals = itinerary.days.reduce((sum, day) => sum + day.meals.length, 0);
                  const remainingBudget = itinerary.totalBudget - itinerary.spentAmount;

                  return (
                    <MotiView
                      key={itinerary.id}
                      from={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', delay: index * 100 }}
                    >
                      <TouchableOpacity
                        style={styles.itineraryCard}
                        activeOpacity={0.8}
                        onPress={() => router.push(`/itinerary/${itinerary.id}`)}
                      >
                        <LinearGradient
                          colors={['#FFF', '#FAFAFA']}
                          style={styles.itineraryCardGradient}
                        >
                          {/* Card Header */}
                          <View style={styles.itineraryCardHeader}>
                            <View style={styles.itineraryCardHeaderLeft}>
                              <View style={styles.itineraryIconContainer}>
                                <Icon name="MapPin" size={20} color="#FA6868" />
                              </View>
                              <View>
                                <Text style={styles.itineraryDestination}>{itinerary.destination}</Text>
                                <Text style={styles.itineraryDates}>
                                  {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </Text>
                              </View>
                            </View>
                            <TouchableOpacity
                              style={styles.deleteButton}
                              onPress={(e) => {
                                e.stopPropagation();
                                removeSavedItinerary(itinerary.id);
                              }}
                            >
                              <Icon name="Trash2" size={18} color="#FF3B30" />
                            </TouchableOpacity>
                          </View>

                          {/* Budget Info */}
                          <View style={styles.itineraryBudgetRow}>
                            <View style={styles.budgetItem}>
                              <Text style={styles.budgetLabel}>Budget</Text>
                              <Text style={styles.budgetValue}>${itinerary.totalBudget}</Text>
                            </View>
                            <View style={styles.budgetDivider} />
                            <View style={styles.budgetItem}>
                              <Text style={styles.budgetLabel}>Remaining</Text>
                              <Text style={[styles.budgetValue, { color: '#34C759' }]}>${remainingBudget.toFixed(0)}</Text>
                            </View>
                            <View style={styles.budgetDivider} />
                            <View style={styles.budgetItem}>
                              <Text style={styles.budgetLabel}>Meals</Text>
                              <Text style={styles.budgetValue}>{totalMeals}</Text>
                            </View>
                          </View>

                          {/* Days Info */}
                          <View style={styles.itineraryDaysRow}>
                            <Icon name="Calendar" size={14} color="#8E8E93" />
                            <Text style={styles.itineraryDaysText}>
                              {itinerary.totalDays} {itinerary.totalDays === 1 ? 'day' : 'days'} • {itinerary.partySize} {itinerary.partySize === 1 ? 'person' : 'people'}
                            </Text>
                          </View>
                        </LinearGradient>
                      </TouchableOpacity>
                    </MotiView>
                  );
                })}
              </View>
            )}
          </MotiView>
        )}

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFF',
    padding: 8,
    shadowColor: '#FCF8F8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 62,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  email: {
    fontSize: 15,
    fontWeight: '500',
    color: '#8E8E93',
  },
  menuContainer: {
    gap: 14,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    },
  menuTextContainer: {
    gap: 4,
    },
  menuTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    },
  menuSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  savedSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  savedSectionHeader: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  savedSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  savedSectionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  emptySavedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#FFF',
    borderRadius: 24,
    gap: 12,
  },
  emptySavedText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  emptySavedSubtext: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  savedItinerariesList: {
    gap: 16,
  },
  itineraryCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  itineraryCardGradient: {
    padding: 20,
  },
  itineraryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  itineraryCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  itineraryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  itineraryDestination: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  itineraryDates: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  itineraryBudgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 12,
  },
  budgetItem: {
    flex: 1,
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 4,
  },
  budgetValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  budgetDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#F0F0F0',
  },
  itineraryDaysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itineraryDaysText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
  },
});
