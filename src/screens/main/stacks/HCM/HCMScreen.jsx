import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleHeader from '../../../../components/SimpleHeader';
import * as Animatable from 'react-native-animatable';
import {useSelector} from 'react-redux';
import {ThemeColors} from '../../../../config/Theme';

export default function HCMScreen({navigation}) {
  const mobileAccessData = useSelector(state => state.Data.mobileAccessData);

  const buttons = [
    {
      name: 'Attendance',
      icon: 'calendar-check',
      screen: 'Attendance',
      color: '#10B981',
      accessKey: 'hcm_attendence',
    },
    {
      name: 'Expense Claim',
      icon: 'file-document-edit',
      screen: 'ExpenseClaimInquiry',
      accessKey: 'hcm_expense_claim',
    },
    {
      name: 'DVR Inquiry',
      icon: 'card-search-outline',
      screen: 'DVRInquiry',
      accessKey: 'hcm_dvr_inquiry',
    },
    {
      name: 'Local Purchase',
      icon: 'cart-plus',
      screen: 'LocalPurchase',
      accessKey: 'hcm_local_purchase',
    },
    {
      name: 'New Orders',
      icon: 'account-multiple-plus',
      screen: 'HCMNewOrders',
      accessKey: 'hcm_new_orders',
    },
    {
      name: 'Salesman Dashboard',
      icon: 'view-dashboard-outline',
      screen: 'SalesmanDashboard',
      accessKey: 'hcm_salesman_dashboard',
    },
  ];

  const renderButton = ({item, index}) => {
    const isDisabled = mobileAccessData?.[0]?.[item.accessKey] === '1';

    return (
      <Animatable.View
        animation="fadeInUp"
        delay={index * 120}
        useNativeDriver
        style={[styles.buttonWrapper, {opacity: isDisabled ? 0.5 : 1}]}>
        <TouchableOpacity
          activeOpacity={isDisabled ? 1 : 0.85}
          disabled={isDisabled}
          onPress={() =>
            isDisabled
              ? null
              : navigation.navigate(
                  item.screen || item.navigate,
                  item.params || {},
                )
          }
          style={styles.buttonContainer}>
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            iterationDelay={4000}
            style={styles.iconContainer}>
            <Icon
              name={item.icon || 'circle'}
              size={22}
              color={ThemeColors.Primary}
            />
          </Animatable.View>
          <View style={{flex: 1}}>
            <Text style={styles.buttonText}>{item.name}</Text>
            {isDisabled && (
              <Text style={{color: ThemeColors.TextMuted, fontSize: 10}}>
                Access Restricted
              </Text>
            )}
          </View>
          {isDisabled && (
            <Icon name="lock" size={16} color={ThemeColors.TextMuted} />
          )}
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  return (
    <View style={styles.container}>
      <SimpleHeader title="HCM" />
      <FlatList
        data={buttons}
        renderItem={renderButton}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.Surface,
  },
  listContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  buttonWrapper: {
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: ThemeColors.Surface,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
  },
  iconContainer: {
    padding: 10,
    marginRight: 12,
    borderRadius: 50,
    backgroundColor: 'rgba(232,127,36,0.1)',
  },
  textContainer: {
    flex: 1,
  },
  buttonText: {
    color: ThemeColors.Primary,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSubtext: {
    color: ThemeColors.TextMuted,
    fontSize: 13,
  },
});
