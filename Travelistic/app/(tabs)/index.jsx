import { Platform, StyleSheet } from 'react-native';

import { ScrollView } from 'react-native';
import {View} from 'react-native';
import { Text } from 'react-native';
import { FlatList } from 'react-native';
import { Dimensions } from 'react-native';

const {width} = Dimensions.get('window');

const budgetItineraries = {
    budget: {
      totalCost: 180,
      costPerDay: 60,
      data: [
        {
          day: 1,
          date: "March 15, 2024",
          dailyCost: 55,
          activities: [
            { 
              time: "9:00 AM", 
              type: "attraction", 
              name: "Central Park", 
              duration: "2 hours",
              cost: 0,
            },
            { 
              time: "11:30 AM", 
              type: "transport", 
              name: "Subway to Lower East Side", 
              duration: "25 min",
              cost: 2.90,
            },
            { 
              time: "12:00 PM", 
              type: "restaurant", 
              name: "Katz's Delicatessen", 
              duration: "1 hour",
              cost: 18,
              priceRange: "$",
            },
            { 
              time: "2:00 PM", 
              type: "attraction", 
              name: "Brooklyn Bridge Walk", 
              duration: "2 hours",
              cost: 0,
            },
          ]
        },
        {
          day: 2,
          date: "March 16, 2024", 
          dailyCost: 62,
          activities: [
            { 
              time: "10:00 AM", 
              type: "attraction", 
              name: "High Line Park", 
              duration: "1.5 hours",
              cost: 0,
            },
            { 
              time: "12:00 PM", 
              type: "restaurant", 
              name: "Joe's Pizza", 
              duration: "30 min",
              cost: 8,
              priceRange: "$",
            },
            { 
              time: "3:00 PM", 
              type: "attraction", 
              name: "Staten Island Ferry", 
              duration: "2 hours",
              cost: 0,
            },
          ]
        }
      ]
    },
    mid: {
      totalCost: 450,
      costPerDay: 150,
      data: [
        {
          day: 1,
          date: "March 15, 2024",
          dailyCost: 148,
          activities: [
            { 
              time: "9:00 AM", 
              type: "attraction", 
              name: "Empire State Building", 
              duration: "2 hours",
              cost: 44,
            },
            { 
              time: "12:00 PM", 
              type: "restaurant", 
              name: "The Plaza Food Hall", 
              duration: "1 hour",
              cost: 35,
              priceRange: "$$",
            },
            { 
              time: "3:00 PM", 
              type: "attraction", 
              name: "Top of the Rock", 
              duration: "2 hours",
              cost: 40,
            },
          ]
        }
      ]
    },
    luxury: {
      totalCost: 900,
      costPerDay: 300,
      data: [
        {
          day: 1,
          date: "March 15, 2024",
          dailyCost: 295,
          activities: [
            { 
              time: "10:00 AM", 
              type: "attraction", 
              name: "Helicopter Tour", 
              duration: "1 hour",
              cost: 200,
            },
            { 
              time: "1:00 PM", 
              type: "restaurant", 
              name: "Le Bernardin", 
              duration: "2 hours",
              cost: 95,
              priceRange: "$$$",
            },
          ]
        }
      ]
    }
  };
  
  // Current selected budget tier
  const currentBudget = 'budget';
  const itineraryData = budgetItineraries[currentBudget].data;
  
  const ActivityCard = ({ activity }) => {
    const getTypeAccent = (type) => {
      switch(type) {
        case 'attraction': return '#6366F1'; // Indigo
        case 'restaurant': return '#EC4899'; // Pink
        case 'transport': return '#06B6D4'; // Cyan
        default: return '#6B7280'; // Gray
      }
    };
  
    return (
      <View style={[styles.glassCard, styles.activityCard]}>
        <View style={styles.activityHeader}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{activity.time}</Text>
            <View style={[styles.typeDot, { backgroundColor: getTypeAccent(activity.type) }]} />
          </View>
          <View style={styles.costContainer}>
            <Text style={styles.costText}>${activity.cost}</Text>
          </View>
        </View>
        
        <View style={styles.activityContent}>
          <Text style={styles.activityName}>{activity.name}</Text>
          <Text style={styles.activityDuration}>{activity.duration}</Text>
          {activity.priceRange && (
            <Text style={[styles.priceRange, { color: getTypeAccent('restaurant') }]}>
              {activity.priceRange}
            </Text>
          )}
        </View>
      </View>
    );
  };
  
  const DayPage = ({ day, date, activities, dailyCost }) => {
    return (
      <View style={styles.dayContainer}>
        <View style={[styles.glassCard, styles.dayHeader]}>
          <Text style={styles.dayTitle}>Day {day}</Text>
          <Text style={styles.dateText}>{date}</Text>
          <Text style={styles.budgetText}>${dailyCost} budget</Text>
        </View>
        
        <ScrollView style={styles.activitiesContainer} showsVerticalScrollIndicator={false}>
          {activities.map((activity, index) => (
            <ActivityCard key={index} activity={activity} />
          ))}
        </ScrollView>
      </View>
    );
  };
  
  const ItinerarySummary = () => {
    const renderDay = ({ item }) => (
      <DayPage 
        day={item.day}
        date={item.date}
        activities={item.activities}
        dailyCost={item.dailyCost}
      />
    );
  
    const getBudgetGradient = (budget) => {
      switch(budget) {
        case 'budget': return '#10B981'; // Emerald
        case 'mid': return '#8B5CF6'; // Purple  
        case 'luxury': return '#EF4444'; // Red
        default: return '#6366F1'; // Indigo
      }
    };
  
    const getBudgetLabel = (budget) => {
      switch(budget) {
        case 'budget': return 'Budget Friendly';
        case 'mid': return 'Mid Range';
        case 'luxury': return 'Luxury Experience';
        default: return 'Standard';
      }
    };
  
    return (
      <View style={styles.container}>
        <View style={[styles.header, { backgroundColor: getBudgetGradient(currentBudget) }]}>
          <View style={[styles.glassCard, styles.headerContent]}>
            <Text style={styles.headerTitle}>New York City</Text>
            <Text style={styles.headerSubtitle}>
              {getBudgetLabel(currentBudget)}
            </Text>
            <Text style={styles.budgetBreakdown}>
              ${budgetItineraries[currentBudget].totalCost} total • ${budgetItineraries[currentBudget].costPerDay}/day
            </Text>
          </View>
        </View>
        
        <FlatList
          data={itineraryData}
          renderItem={renderDay}
          keyExtractor={(item) => item.day.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={width}
          decelerationRate="fast"
        />
        
        <View style={styles.footer}>
          <Text style={styles.swipeHint}>Swipe to navigate days</Text>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F1F5F9', // Light gray background
    },
    header: {
      paddingTop: 60,
      paddingBottom: 30,
      paddingHorizontal: 20,
    },
    headerContent: {
      paddingVertical: 24,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    glassCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 24,
      elevation: 8,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: '700',
      color: 'white',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.9)',
      fontWeight: '500',
      marginBottom: 2,
    },
    budgetBreakdown: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.8)',
      fontWeight: '400',
    },
    dayContainer: {
      width: width,
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    dayHeader: {
      paddingVertical: 20,
      paddingHorizontal: 24,
      alignItems: 'center',
      marginBottom: 20,
    },
    dayTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: 4,
    },
    dateText: {
      fontSize: 16,
      color: '#6B7280',
      fontWeight: '500',
      marginBottom: 8,
    },
    budgetText: {
      fontSize: 14,
      color: '#059669',
      fontWeight: '600',
    },
    activitiesContainer: {
      flex: 1,
    },
    activityCard: {
      marginBottom: 16,
      padding: 20,
    },
    activityHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    timeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    timeText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#374151',
      marginRight: 8,
    },
    typeDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    costContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    costText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#374151',
    },
    activityContent: {
      alignItems: 'flex-start',
    },
    activityName: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: 6,
    },
    activityDuration: {
      fontSize: 14,
      color: '#6B7280',
      fontWeight: '500',
      marginBottom: 4,
    },
    priceRange: {
      fontSize: 14,
      fontWeight: '600',
    },
    footer: {
      padding: 20,
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    swipeHint: {
      fontSize: 14,
      color: '#6B7280',
      fontWeight: '500',
    },
  });
  
  export default ItinerarySummary;