import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import SimpleHeader from '../../../../components/SimpleHeader';
import {ThemeColors} from '../../../../config/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText from '../../../../components/AppText';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../../utils/Responsive';

const GeneralAlertsScreen = () => {
  const alerts = [
    {
      id: 1,
      title: 'CNIC Expiration Alert',
      message: 'Your CNIC is due to expire in 30 days. Please initiate the renewal process soon.',
      date: '2026-05-11',
      type: 'warning',
      icon: 'card-outline',
    },
    {
      id: 2,
      title: 'Passport Renewal Reminder',
      message: 'Passport renewal is required within the next 3 months to avoid international travel disruptions.',
      date: '2026-07-15',
      type: 'info',
      icon: 'airplane-outline',
    },
    {
      id: 3,
      title: 'Driving License Renewal',
      message: 'Your driving license has reached its renewal period. Please visit the traffic police office.',
      date: '2026-04-20',
      type: 'error',
      icon: 'car-outline',
    },
    {
        id: 4,
        title: 'Training Completion Due',
        message: 'The mandatory safety training module "Hazards at Workspace" must be completed by end of week.',
        date: '2026-04-15',
        type: 'info',
        icon: 'school-outline',
      },
  ];

  const getStatusColor = (type) => {
    switch (type) {
      case 'warning': return '#F59E0B'; // Amber
      case 'error': return '#EF4444'; // Red
      case 'info': return ThemeColors.Primary; // Orange
      default: return ThemeColors.TextMuted;
    }
  };

  return (
    <View style={styles.container}>
      <SimpleHeader title="General Alerts" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <AppText 
            title="Recent Notifications" 
            titleSize={2.2} 
            titleWeight 
            titleColor={ThemeColors.TextMain} 
          />
          <AppText 
            title="Stay updated with your document expiries and reminders." 
            titleSize={1.5} 
            titleColor={ThemeColors.TextMuted} 
          />
        </View>

        {alerts.map((alert) => (
          <View key={alert.id} style={styles.alertCard}>
            <View style={[styles.iconContainer, { backgroundColor: getStatusColor(alert.type) + '15' }]}>
              <Ionicons name={alert.icon} size={24} color={getStatusColor(alert.type)} />
            </View>
            
            <View style={styles.contentContainer}>
              <View style={styles.cardHeader}>
                <AppText 
                  title={alert.title} 
                  titleSize={1.8} 
                  titleWeight 
                  titleColor={ThemeColors.TextMain} 
                />
                <View style={[styles.badge, { backgroundColor: getStatusColor(alert.type) }]}>
                  <Text style={styles.badgeText}>{alert.type.toUpperCase()}</Text>
                </View>
              </View>
              
              <AppText 
                title={alert.message} 
                titleSize={1.4} 
                titleColor={ThemeColors.TextMuted} 
                style={{ marginTop: 4 }}
              />
              
              <View style={styles.cardFooter}>
                <Ionicons name="calendar-clear-outline" size={14} color={ThemeColors.TextMuted} />
                <Text style={styles.dateText}>Due: {alert.date}</Text>
              </View>
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.Background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 20,
  },
  alertCard: {
    backgroundColor: ThemeColors.Surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: ThemeColors.Primary,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: ThemeColors.TextMuted,
    fontWeight: '500',
  },
});

export default GeneralAlertsScreen;
