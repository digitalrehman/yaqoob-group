import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import PlatformGradient from '../../../../components/PlatformGradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleHeader from '../../../../components/SimpleHeader';
import {APPCOLORS} from '../../../../utils/APPCOLORS';
import * as Animatable from 'react-native-animatable';
import {useSelector} from 'react-redux';
import {ThemeColors} from '../../../../config/Theme';

const buttons = [
  {
    name: 'Add Item',
    icon: 'plus-box',
    screen: 'AddItem',
    accessKey: 'add_item',
  },
  {
    name: 'Search Item',
    icon: 'magnify',
    screen: 'ViewItem',
    accessKey: 'search_item',
  },
  {
    name: 'Item Movement',
    icon: 'swap-horizontal',
    screen: 'StockMovements',
    accessKey: 'item_movement',
  },
  {
    name: 'Location Transfer',
    icon: 'map-marker-multiple',
    screen: 'LocationTransfer',
    accessKey: 'location_transfer',
  },
  {
    name: 'Inventory Ajustment',
    icon: 'playlist-edit',
    screen: 'InventoryAjustment',
    accessKey: 'inventory_adjustment',
  },
  {
    name: 'Dated Stock Sheet',
    icon: 'calendar-text',
    screen: 'StockSheetScreen',
    accessKey: 'dated_stock_sheet',
  },
  {
    name: 'Inventory Transactions',
    icon: 'check-circle',
    screen: 'ApprovedRecordsScreen',
    params: {screenType: 'inventory'},
    accessKey: 'inventory_transction',
  },
];

export default function InventoryScreen({navigation}) {
  const mobileAccessData = useSelector(state => state.Data.mobileAccessData);

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
          onPress={() => (isDisabled ? null : navigation.navigate(item.screen || item.navigate, item.params || {}))}
          style={styles.buttonContainer}>
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            iterationDelay={4000}
            style={styles.iconContainer}>
            <Icon name={item.icon || 'circle'} size={22} color={ThemeColors.Primary} />
          </Animatable.View>
          <View style={{flex: 1}}>
            <Text style={styles.buttonText}>{item.name}</Text>
            {isDisabled && (
              <Text style={{color: ThemeColors.TextMuted, fontSize: 10}}>
                Access Restricted
              </Text>
            )}
          </View>
          {isDisabled && <Icon name="lock" size={16} color={ThemeColors.TextMuted} />}
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  return (
    <View style={styles.container}>
      <SimpleHeader title="Inventory" />
      <FlatList
        data={buttons}
        renderItem={renderButton}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{paddingVertical: 20}}
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
    marginHorizontal: 16,
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
