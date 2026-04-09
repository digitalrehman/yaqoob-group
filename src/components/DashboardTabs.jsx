import {View, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {responsiveHeight, responsiveWidth} from '../utils/Responsive';
import AppText from './AppText';
import Feather from 'react-native-vector-icons/Feather';
import {ThemeColors} from '../config/Theme';

const DashboardTabs = ({name, onPress, icon, disabled}) => {
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.7}
      style={[
        styles.cardInfo,
        { opacity: disabled ? 0.5 : 1 }
      ]}>
      <View style={styles.iconWrapper}>
        <Feather name={icon} size={22} color={ThemeColors.Primary} />
      </View>
      <AppText
        title={name}
        titleColor={ThemeColors.TextMain}
        titleSize={1.6}
        titleWeight={true}
        numberOfLines={1}
        ellipsizeMode="tail"
        style={styles.textLabel}
      />
    </TouchableOpacity>
  );
};

export default DashboardTabs;

const styles = StyleSheet.create({
  cardInfo: {
    height: responsiveHeight(9),
    width: responsiveWidth(44), // Two per row neatly horizontally
    backgroundColor: ThemeColors.Surface,
    borderRadius: 18,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: ThemeColors.Border,
  },
  iconWrapper: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(232, 127, 36, 0.1)', // Light orange tint
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textLabel: {
    flex: 1,
  }
});
