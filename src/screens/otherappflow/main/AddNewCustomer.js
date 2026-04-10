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
import PlatformGradient from '../../../components/PlatformGradient';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import {useSelector} from 'react-redux';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASEURL} from '../../../utils/BaseUrl';
import {APPCOLORS} from '../../../utils/APPCOLORS';
import {responsiveWidth} from '../../../utils/Responsive';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const AddNewCustomer = ({navigation}) => {
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
    val?.debtor_ref?.toLowerCase()?.includes(Search.toLowerCase()),
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
        'GetAllCustomers',
        JSON.stringify(res.data.data),
      );
    } catch (err) {
      const offlineData = await AsyncStorage.getItem('GetAllCustomers');
      if (offlineData) setAllOrders(JSON.parse(offlineData));
    } finally {
      setLoader(false);
    }
  };

  const loaderMoreData = async () => {
    setLoadMore(true);
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

      const newData = [...res.data.data].reverse();
      const allOrders = [...AllOrders, ...newData];
      const uniqueOrders = allOrders.filter(
        (order, index, self) =>
          index === self.findIndex(o => o.debtor_ref === order.debtor_ref),
      );

      setAllOrders(uniqueOrders.slice(0, 50));
      setPage(prev => prev + 1);
      await AsyncStorage.setItem(
        'GetAllCustomers',
        JSON.stringify(res.data.data),
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoadMore(false);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#F3F4F6'}}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingBottom: 15,
          paddingTop: Platform.OS === 'ios' ? insets.top + 25 : insets.top + 30,
          backgroundColor: '#E87F24',
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
          elevation: 5,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            height: 40,
            width: 40,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
            shadowColor: '#000',
            shadowOffset: {width: 2, height: 2},
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
          }}>
          <Ionicons name="arrow-back" size={20} color="#E87F24" />
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            height: 40,
            borderRadius: 10,
            paddingHorizontal: 12,
            marginHorizontal: 10,
            backgroundColor: '#FFFFFF',
            shadowColor: '#000',
            shadowOffset: {width: 2, height: 2},
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
          }}>
          <Ionicons
            name="search"
            size={18}
            color="#E87F24"
            style={{marginRight: 8}}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#E87F24"
            style={{flex: 1, fontSize: 14, color: '#E87F24', padding: 0}}
            onChangeText={txt => setSearch(txt)}
            value={Search}
          />
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('InsertNewCustomerDetail', {
              allCustomer: AllOrders,
              onSuccess: () => getAllOrders(),
            })
          }
          style={{
            height: 40,
            width: 40,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
            elevation: 3,
          }}>
          <Ionicons name="person-add" size={20} color="#E87F24" />
        </TouchableOpacity>
      </View>

      {/* Loader */}
      {Loader ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <LottieView
            source={require('../../../assets/images/Loader.json')}
            style={{height: 250, width: 250}}
            autoPlay
            loop
          />
        </View>
      ) : (
        <View style={{flex: 1, alignItems: 'center'}}>
          {loadermore && (
            <ActivityIndicator
              size="large"
              color="#E87F24"
              style={{position: 'absolute', top: 10}}
            />
          )}
          {filteredOrders?.length > 0 ? (
            <FlatList
              data={filteredOrders}
              onEndReached={loaderMoreData}
              onEndReachedThreshold={1}
              contentContainerStyle={{paddingBottom: 80, paddingTop: 10}}
              renderItem={({item}) => (
                <View style={styles.card}>
                  <View style={styles.row}>
                    <Text style={styles.label}>1. Business Name</Text>
                    <Text style={styles.value}>{item?.name}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>2. Address</Text>
                    <Text style={styles.value} numberOfLines={1}>
                      {item?.address || 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>3. NTN</Text>
                    <Text style={styles.value}>{item?.ntn_id || 'N/A'}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>4. POC Name</Text>
                    <Text style={styles.value}>{item?.poc_name || 'N/A'}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>5. Contact No</Text>
                    <Text style={styles.value}>
                      {item?.contact_no || 'N/A'}
                    </Text>
                  </View>
                </View>
              )}
            />
          ) : (
            <Text style={{color: '#666', fontSize: 20}}>No Record Found</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default AddNewCustomer;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 6,
    padding: 15,
    width: responsiveWidth(92),
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#E87F24',
    fontWeight: 'bold',
  },
  value: {
    color: '#1E293B',
    fontWeight: '700',
    maxWidth: '60%',
  },
});