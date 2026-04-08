import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PlatformGradient from '../../../../components/PlatformGradient';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import {useSelector} from 'react-redux';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASEURL} from '../../../../utils/BaseUrl';
import {APPCOLORS} from '../../../../utils/APPCOLORS';
import {responsiveWidth} from '../../../../utils/Responsive';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const HCMNewOrders = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const CurrentUser = useSelector(state => state.Data.currentData);
  const day = moment().format('dddd');

  const [AllOrders, setAllOrders] = useState([]);
  const [Loader, setLoader] = useState(true);
  const [Search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [loadermore, setLoadMore] = useState(false);

  useEffect(() => {
    getAllOrders();
  }, []);

  const filteredOrders = AllOrders?.filter(val =>
    val?.name?.toLowerCase()?.includes(Search.toLowerCase()),
  ).slice(0, 50);

  const getAllOrders = async () => {
    setLoader(true);
    let datas = new FormData();
    datas.append('dim_id', CurrentUser?.dim_id);
    datas.append('area_code', CurrentUser?.area_code);
    datas.append('role_id', CurrentUser?.role_id);
    datas.append('week_day', day);
    datas.append('customer_status', 0);
    datas.append('page', page);

    try {
      const res = await axios.post(`${BASEURL}debtors_master.php`, datas, {
        headers: {'Content-Type': 'multipart/form-data'},
      });

      const newData = [...res.data.data];
      const uniqueOrders = newData.filter(
        (order, index, self) =>
          index === self.findIndex(o => o.debtor_ref === order.debtor_ref),
      );

      setAllOrders(uniqueOrders.slice(0, 50));
      await AsyncStorage.setItem(
        'GetAllCustomersHCM',
        JSON.stringify(res.data.data),
      );
    } catch (err) {
      const offlineData = await AsyncStorage.getItem('GetAllCustomersHCM');
      if (offlineData) setAllOrders(JSON.parse(offlineData));
    } finally {
      setLoader(false);
    }
  };

  const loaderMoreData = async () => {
    if (loadermore) return;
    setLoadMore(true);
    let datas = new FormData();
    datas.append('dim_id', CurrentUser?.dim_id);
    datas.append('area_code', CurrentUser?.area_code);
    datas.append('role_id', CurrentUser?.role_id);
    datas.append('week_day', day);
    datas.append('customer_status', 0);
    datas.append('page', page + 1);

    try {
      const res = await axios.post(`${BASEURL}debtors_master.php`, datas, {
        headers: {'Content-Type': 'multipart/form-data'},
      });

      const newData = [...res.data.data];
      const allOrders = [...AllOrders, ...newData];
      const uniqueOrders = allOrders.filter(
        (order, index, self) =>
          index === self.findIndex(o => o.debtor_ref === order.debtor_ref),
      );

      setAllOrders(uniqueOrders.slice(0, 50));
      setPage(prev => prev + 1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadMore(false);
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.card}>
      {/* Top Row: Name and Phone */}
      <View style={styles.cardHeader}>
        <View style={styles.iconRow}>
          <Ionicons name="person-outline" size={18} color="#000" />
          <Text style={styles.customerName}>{item.name || 'Test-Hasaan'}</Text>
        </View>
        <View style={styles.iconRow}>
          <Ionicons name="call-outline" size={18} color="#000" />
          <Text style={styles.customerPhone}>{item.contact_no || '03000096347'}</Text>
        </View>
      </View>

      {/* Address Row */}
      <View style={[styles.iconRow, {marginTop: 8}]}>
        <Ionicons name="location-outline" size={18} color="#000" />
        <Text style={styles.customerAddress}>{item.address || 'Abc'}</Text>
      </View>

      {/* Buttons Row 1 */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.gradientButton}>
          <PlatformGradient
            colors={['#1a1c22', '#434343']}
            style={styles.gradientInside}>
            <Text style={styles.buttonText}>Take Order</Text>
          </PlatformGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gradientButton}>
          <PlatformGradient
            colors={['#1a1c22', '#434343']}
            style={styles.gradientInside}>
            <Text style={styles.buttonText}>Return</Text>
          </PlatformGradient>
        </TouchableOpacity>
      </View>

      {/* Buttons Row 2 + Stats */}
      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.paymentButton}>
          <PlatformGradient
            colors={['#1a1c22', '#434343']}
            style={styles.paymentGradient}>
            <Text style={styles.buttonText}>Payment</Text>
          </PlatformGradient>
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Last Order</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Order</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Pay</Text>
            <Text style={styles.statValue}>Rs 0.00</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Header with Search and Add Button */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingBottom: 15,
          paddingTop: Platform.OS === 'ios' ? insets.top + 25 : insets.top + 30,
          backgroundColor: '#1a1c22',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerIconButton}>
          <Ionicons name="arrow-back" size={20} color="#333" />
        </TouchableOpacity>

        <PlatformGradient
          colors={['#000000', '#434343']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.searchBarGradient}>
          <Ionicons
            name="search"
            size={18}
            color="#fff"
            style={{marginRight: 8}}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#aaa"
            style={styles.searchInput}
            onChangeText={txt => setSearch(txt)}
            value={Search}
          />
        </PlatformGradient>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('HCMInsertNewCustomer', {
              onSuccess: () => getAllOrders(),
            })
          }
          style={[styles.headerIconButton, {backgroundColor: APPCOLORS.Secondary}]}>
          <Ionicons name="person-add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Loader */}
      {Loader ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <LottieView
            source={require('../../../../assets/images/Loader.json')}
            style={{height: 250, width: 250}}
            autoPlay
            loop
          />
        </View>
      ) : (
        <View style={{flex: 1}}>
          <FlatList
            data={filteredOrders}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={loaderMoreData}
            onEndReachedThreshold={0.5}
            contentContainerStyle={{paddingBottom: 20, paddingTop: 10}}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No Record Found</Text>
              </View>
            )}
            ListFooterComponent={() =>
              loadermore ? (
                <ActivityIndicator size="small" color="#1a1c22" />
              ) : null
            }
          />
        </View>
      )}
    </View>
  );
};

export default HCMNewOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  headerIconButton: {
    height: 40,
    width: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0E5EC',
    elevation: 3,
  },
  searchBarGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    padding: 0,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1c22',
    marginLeft: 6,
  },
  customerPhone: {
    fontSize: 14,
    color: '#1a1c22',
    marginLeft: 6,
  },
  customerAddress: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  gradientButton: {
    width: '48%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  gradientInside: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    justifyContent: 'space-between',
  },
  paymentButton: {
    width: '30%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  paymentGradient: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  statItem: {
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 11,
    color: '#1a1c22',
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
