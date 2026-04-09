import { View, TouchableOpacity, Platform } from 'react-native';
import React from 'react';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../utils/Responsive';
import AppText from './AppText';
import { ThemeColors } from '../config/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../redux/AuthSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AppHeader = ({ title, onPress }) => {
  const userData = useSelector(state => state.Data.currentData);
  const dispatch = useDispatch();
  const nav = useNavigation();
  const insets = useSafeAreaInsets();

  // iOS ke liye proper padding, Android ke liye extra vertical padding
  const paddingTop = Platform.OS === 'ios' 
      ? insets.top + 10 
      : insets.top + 15; // Android ke liye extra padding

  return (
    <View
      style={{
        paddingTop: paddingTop,
        paddingHorizontal: 20,
        paddingBottom: 25,
        backgroundColor: ThemeColors.Primary,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 6,
        shadowColor: ThemeColors.Primary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      }}>
      
      {/* Top Welcome & Brand Row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <View>
          <AppText
            title="Yaqoob Group"
            titleColor={ThemeColors.TextLight}
            titleSize={1.4}
          />
          <AppText
            title={`Welcome back, ${userData?.real_name || 'User'}!`}
            titleColor={ThemeColors.TextLight}
            titleSize={2}
            titleWeight
          />
        </View>
        <View
            style={{
              height: 40,
              width: 40,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: ThemeColors.Surface,
              borderRadius: 20,
            }}>
            <AppText title="MA" titleColor={ThemeColors.Primary} titleWeight/>
        </View>
      </View>

      {/* Action Icons Row */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 15,
        }}>
          <TouchableOpacity onPress={() => onPress?.('bell')} style={{ padding: 5 }}>
            <FontAwesome
              name="bell"
              color={ThemeColors.TextLight}
              size={20}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onPress?.('mail')} style={{ padding: 5 }}>
            <Entypo
              name="mail"
              color={ThemeColors.TextLight}
              size={20}
            />
          </TouchableOpacity>

          <View style={{ height: 15, backgroundColor: 'rgba(255,255,255,0.4)', width: 1 }} />

          <TouchableOpacity onPress={() => nav.navigate('ProfitAndLossScreen')} style={{ padding: 5 }}>
            <Ionicons
              name="person"
              color={ThemeColors.TextLight}
              size={20}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => dispatch(setLogout())} style={{ padding: 5 }}>
            <AntDesign
              name="poweroff"
              color={ThemeColors.Surface}
              size={20}
            />
          </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppHeader;
