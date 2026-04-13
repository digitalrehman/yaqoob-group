import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import SimpleHeader from '../../../../components/SimpleHeader';
import {ThemeColors} from '../../../../config/Theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import AppText from '../../../../components/AppText';

const {width} = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const SalesmanDashboard = () => {
  const summaryData = [
    {
      label: 'Base Salary',
      value: 'Rs. 50,000',
      icon: 'cash-multiple',
      color: '#3498DB',
    },
    {
      label: 'Fixed Commission',
      value: 'Rs. 15,000',
      icon: 'percent',
      color: '#2ECC71',
    },
    {
      label: 'Variable Commission',
      value: 'Rs. 20,000',
      icon: 'chart-line',
      color: '#9B59B6',
    },
    {
      label: 'Incentives',
      value: 'Rs. 10,000',
      icon: 'gift-outline',
      color: '#F1C40F',
    },
    {
      label: 'Total Deductions',
      value: 'Rs. 5,000',
      icon: 'minus-circle-outline',
      color: '#E74C3C',
    },
    {
      label: 'Net Payable',
      value: 'Rs. 90,000',
      icon: 'wallet-outline',
      color: ThemeColors.Primary,
    },
    {
      label: 'Working Hours',
      value: '160/160',
      icon: 'clock-outline',
      color: '#34495E',
    },
    {
      label: 'Leave Balance',
      value: '4 days',
      icon: 'calendar-blank',
      color: '#1ABC9C',
    },
  ];

  return (
    <View style={styles.container}>
      <SimpleHeader title="Salesman Dashboard" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animatable.View animation="fadeInDown" duration={800} style={styles.headerInfo}>
          <AppText 
            title="Compensation Summary" 
            titleSize={2.2} 
            titleWeight 
            titleColor={ThemeColors.TextMain} 
          />
          <AppText 
            title="Overview of your current earnings and performance metrics." 
            titleSize={1.4} 
            titleColor={ThemeColors.TextMuted} 
          />
        </Animatable.View>

        {/* Monthly Overview Section */}
        <View style={styles.sectionContainer}>
          <AppText title="Monthly Overview" titleSize={2} titleWeight titleColor={ThemeColors.TextMain} />
          <View style={styles.row}>
            <Animatable.View animation="fadeInLeft" style={styles.wideCard}>
              <View style={styles.wideCardContent}>
                <View style={[styles.iconWrapper, {backgroundColor: '#2ECC7115'}]}>
                  <Icon name="currency-usd" size={24} color="#2ECC71" />
                </View>
                <View>
                  <Text style={styles.cardLabel}>Current Month Earning</Text>
                  <Text style={[styles.cardValue, {fontSize: 20, color: '#2ECC71'}]}>Rs. 125,000</Text>
                </View>
              </View>
            </Animatable.View>
            <Animatable.View animation="fadeInRight" style={styles.wideCard}>
              <View style={styles.wideCardContent}>
                <View style={[styles.iconWrapper, {backgroundColor: '#E74C3C15'}]}>
                  <Icon name="receipt" size={24} color="#E74C3C" />
                </View>
                <View>
                  <Text style={styles.cardLabel}>Current Month Expense</Text>
                  <Text style={[styles.cardValue, {fontSize: 20, color: '#E74C3C'}]}>Rs. 15,000</Text>
                </View>
              </View>
            </Animatable.View>
          </View>
        </View>

        {/* Recovery Status Section */}
        <Animatable.View animation="fadeInUp" style={[styles.card, {width: '100%', marginBottom: 24}]}>
          <View style={styles.recoveryHeader}>
            <View style={[styles.iconWrapper, {backgroundColor: ThemeColors.Primary + '15', marginBottom: 0}]}>
              <Icon name="cash-check" size={24} color={ThemeColors.Primary} />
            </View>
            <AppText title="Recovery Status" titleSize={1.8} titleWeight titleColor={ThemeColors.TextMain} />
          </View>
          
          <View style={styles.recoveryGrid}>
            <View style={styles.recoveryItem}>
              <Text style={styles.recoveryLabel}>Outstanding</Text>
              <Text style={[styles.recoveryValue, {color: '#F1C40F'}]}>Rs. 45,000</Text>
              <View style={styles.dotLine} />
            </View>
            <View style={styles.recoveryItem}>
              <Text style={styles.recoveryLabel}>Recovered</Text>
              <Text style={[styles.recoveryValue, {color: '#2ECC71'}]}>Rs. 80,000</Text>
              <View style={styles.dotLine} />
            </View>
            <View style={styles.recoveryItem}>
              <Text style={styles.recoveryLabel}>Pending</Text>
              <Text style={[styles.recoveryValue, {color: '#E74C3C'}]}>Rs. 10,000</Text>
            </View>
          </View>
        </Animatable.View>

        {/* Salary Components Grid */}
        <View style={styles.sectionContainer}>
          <AppText title="Salary & Compensation" titleSize={2} titleWeight titleColor={ThemeColors.TextMain} />
        </View>
        <View style={styles.statsGrid}>
          {summaryData.map((item, index) => (
            <Animatable.View 
              key={index} 
              animation="zoomIn" 
              delay={index * 100}
              style={styles.card}
            >
              <View style={[styles.iconWrapper, {backgroundColor: item.color + '15'}]}>
                <Icon name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={styles.cardLabel}>{item.label}</Text>
              <Text style={[styles.cardValue, {color: item.color === ThemeColors.Primary ? ThemeColors.Primary : ThemeColors.TextMain}]}>
                {item.value}
              </Text>
              <View style={[styles.progressBar, {backgroundColor: item.color + '20'}]}>
                <View style={[styles.progressFill, {backgroundColor: item.color, width: '70%'}]} />
              </View>
            </Animatable.View>
          ))}
        </View>

        {/* Highlight Banner */}
        <Animatable.View animation="fadeInUp" delay={800} style={styles.banner}>
           <View style={styles.bannerLeft}>
              <Icon name="medal" size={30} color="#FFF" />
              <View>
                 <Text style={styles.bannerTitle}>Performance Bonus!</Text>
                 <Text style={styles.bannerSub}>Commission Exceeding Target!</Text>
              </View>
           </View>
           <TouchableOpacity style={styles.bannerBtn}>
              <Text style={styles.bannerBtnText}>View Details</Text>
           </TouchableOpacity>
        </Animatable.View>

        <View style={{height: 30}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.Background,
  },
  scrollContent: {
    padding: 16,
  },
  headerInfo: {
    marginBottom: 20,
    backgroundColor: ThemeColors.Surface,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 5,
    borderLeftColor: ThemeColors.Primary,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    width: cardWidth,
    backgroundColor: ThemeColors.Surface,
    borderRadius: 20,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 12,
    color: ThemeColors.TextMuted,
    fontWeight: '500',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  sectionContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  wideCard: {
    flex: 1,
    backgroundColor: ThemeColors.Surface,
    borderRadius: 16,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  wideCardContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
  },
  recoveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 12,
  },
  recoveryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recoveryItem: {
    flex: 1,
    alignItems: 'center',
  },
  recoveryLabel: {
    fontSize: 11,
    color: ThemeColors.TextMuted,
    marginBottom: 4,
    fontWeight: '500',
  },
  recoveryValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  dotLine: {
    position: 'absolute',
    right: 0,
    top: '20%',
    height: '60%',
    width: 1,
    backgroundColor: '#E1E8EE',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  banner: {
      backgroundColor: '#E74C3C', // Using a distinct red for alerts as per image
      borderRadius: 16,
      padding: 16,
      marginTop: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      elevation: 5,
      shadowColor: '#E74C3C',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 10,
  },
  bannerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
  },
  bannerTitle: {
      color: '#FFF',
      fontSize: 15,
      fontWeight: '700',
  },
  bannerSub: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 11,
  },
  bannerBtn: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#FFF',
  },
  bannerBtnText: {
      color: '#FFF',
      fontSize: 11,
      fontWeight: '600',
  }
});

export default SalesmanDashboard;
