import {View, Text, TouchableOpacity, Platform} from 'react-native';
import React from 'react';
import AppText from './AppText';
import {APPCOLORS} from '../utils/APPCOLORS';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {responsiveFontSize, responsiveHeight} from '../utils/Responsive';
import {ThemeColors} from '../config/Theme';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const SimpleHeader = ({title}) => {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();

  const paddingTop = Platform.OS === 'ios' ? insets.top + 25 : insets.top + 30;
  const paddingBottom = Platform.OS === 'ios' ? 20 : 25;

  return (
    <View
      style={{
        backgroundColor: ThemeColors.Primary,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: paddingTop,
        paddingBottom: paddingBottom,
        elevation: 6,
        shadowColor: ThemeColors.Primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
      }}>
      <TouchableOpacity onPress={() => nav.goBack()}>
        <Ionicons
          name={'arrow-back'}
          size={responsiveFontSize(3)}
          color={APPCOLORS.WHITE}
        />
      </TouchableOpacity>

      <AppText
        title={title}
        titleColor={APPCOLORS.WHITE}
        titleSize={3}
        titleWeight
      />

      <TouchableOpacity onPress={() => nav.navigate('Dashboard')}>
        <Ionicons
          name={'person'}
          size={responsiveFontSize(3)}
          color={APPCOLORS.WHITE}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SimpleHeader;
