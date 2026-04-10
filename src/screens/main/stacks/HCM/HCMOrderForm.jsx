import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../../../../components/AppText';
import axios from 'axios';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {
  setCartData,
  setLoader,
  setGrandCartTotalPrice,
} from '../../../../redux/AuthSlice';
import moment from 'moment';
import NetInfo from '@react-native-community/netinfo';
import {BASEURL} from '../../../../utils/BaseUrl';

import {ThemeColors} from '../../../../config/Theme';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from '../../../../utils/Responsive';

const HCMOrderForm = ({navigation, route}) => {
  const {customer, mode} = route.params || {};
  const dispatch = useDispatch();
  
  const cart = useSelector(state => state.Data.cartData);
  const CurrentUser = useSelector(state => state.Data.currentData);
  const AllProducts = useSelector(state => state.Data.AllProduct);
  
  const [ProductModal, setProductModal] = useState(false);
  const [Search, setSearch] = useState('');
  const [selectProduct, setSelectProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('0');
  const [discount, setDiscount] = useState('0');
  const [orderLoader, setOrderLoader] = useState(false);
  const insets = useSafeAreaInsets();

  const paddingTop = Platform.OS === 'ios' ? insets.top + 25 : insets.top + 30;
  const paddingBottom = Platform.OS === 'ios' ? 20 : 25;

  // Derived Values
  const subtotal = cart?.reduce((sum, item) => sum + parseFloat(item.GrandTotal || 0), 0);
  const totalDiscount = cart?.reduce((sum, item) => sum + (parseFloat(item.unit_price) * parseInt(item.quantity_ordered) * (parseFloat(item.ProductDiscount) / 100)), 0);
  const grandTotal = subtotal; // In this logic, GrandTotal already includes item-wise discount

  const handleQuantityChange = (type) => {
    if (type === 'plus') {
      setQuantity(prev => prev + 1);
    } else {
      setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    }
  };

  const addToCart = async () => {
    if (!selectProduct) {
      Toast.show({type: 'error', text1: 'Please Select a Product'});
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      Toast.show({type: 'error', text1: 'Please enter a valid Price'});
      return;
    }

    const itemCode = selectProduct.item_code;
    const isExist = cart?.some(item => item.item_code === itemCode);

    if (isExist) {
      Toast.show({type: 'error', text1: 'Item already exists in the cart'});
      return;
    }

    let discountedPrice = parseFloat(price) - (parseFloat(price) * (parseFloat(discount) / 100));
    let itemGrandTotal = (discountedPrice * quantity).toFixed(2);

    const newItem = {
      description: selectProduct.description,
      unit_price: price,
      quantity_ordered: quantity,
      item_code: itemCode,
      ProductDiscount: discount,
      GrandTotal: itemGrandTotal,
    };

    const newCart = [...cart, newItem];
    dispatch(setCartData(newCart));
    
    // Reset fields
    setSelectProduct(null);
    setQuantity(1);
    setPrice('0');
    setDiscount('0');
    
    Toast.show({type: 'success', text1: 'Item added to cart'});
  };

  const confirmOrder = async () => {
    if (cart.length === 0) {
      Toast.show({type: 'error', text1: 'Cart is empty'});
      return;
    }

    setOrderLoader(true);
    const formattedDate = moment().format('YYYY-MM-DD');

    const state = await NetInfo.fetch();
    if (!state.isConnected) {
        // Offline logic (simplified for now as per AddItems.js)
        const getSavedData = await AsyncStorage.getItem('setUserOr');
        let orderPostArray = getSavedData ? JSON.parse(getSavedData) : [];
        
        const newOrder = {
            CustName: customer?.name,
            person_id: customer?.debtor_no || customer?.debtor_ref,
            ord_date: formattedDate,
            total: grandTotal,
            purch_order_details: JSON.stringify(cart),
            loc_code: CurrentUser?.loc_code,
            dim_id: CurrentUser?.dim_id,
            salesman: CurrentUser?.salesman,
            user_id: CurrentUser?.id,
            paymentType: mode === 'Return' ? '12' : '30', // Assuming 30 for order, Adjust as needed
        };
        
        orderPostArray.push(newOrder);
        await AsyncStorage.setItem('setUserOr', JSON.stringify(orderPostArray));
        
        dispatch(setCartData([]));
        setOrderLoader(false);
        Toast.show({type: 'success', text1: 'Order saved offline'});
        navigation.goBack();
        return;
    }

    // Online logic
    let datas = new FormData();
    datas.append('CustName', customer?.name);
    datas.append('trans_type', mode === 'Return' ? '12' : '30');
    datas.append('person_id', customer?.debtor_no || customer?.debtor_ref);
    datas.append('ord_date', formattedDate);
    datas.append('payments', '1');
    datas.append('location', 'DEF');
    datas.append('total', grandTotal);
    datas.append('purch_order_details', JSON.stringify(cart));
    datas.append('loc_code', CurrentUser?.loc_code);
    datas.append('dim_id', CurrentUser?.dim_id);
    datas.append('salesman', CurrentUser?.salesman);
    datas.append('user_id', CurrentUser?.id);

    try {
      await axios.post(`${BASEURL}post_service_purch_sale.php`, datas, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      dispatch(setCartData([]));
      Toast.show({type: 'success', text1: 'Order confirmed successfully'});
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Toast.show({type: 'error', text1: 'Failed to confirm order'});
    } finally {
      setOrderLoader(false);
    }
  };

  const filteredProducts = AllProducts?.filter(val =>
    val.description.toLowerCase().includes(Search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Custom Header similar to SimpleHeader */}
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingTop: paddingTop,
          paddingBottom: paddingBottom,
          backgroundColor: ThemeColors.Primary,
        }}>
        <TouchableOpacity onPress={() => {
            dispatch(setCartData([]));
            navigation.goBack();
        }}>
          <Ionicons name="arrow-back" size={responsiveFontSize(3)} color={ThemeColors.Surface} />
        </TouchableOpacity>
        
        <AppText
            title={mode === 'Return' ? 'Return Items' : 'Take Order'}
            titleColor={ThemeColors.Surface}
            titleSize={3}
            titleWeight
        />
        
        <TouchableOpacity 
            onPress={() => navigation.navigate(' <SimpleHeader title="HCM" />', {data: customer})}
            style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cart?.length || 0}</Text>
          </View>
          <Ionicons name="cart" size={responsiveFontSize(3)} color={ThemeColors.Surface} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          {/* Select Product */}
          <TouchableOpacity 
            onPress={() => setProductModal(true)}
            style={styles.inputContainer}>
            <Text style={styles.label}>Select Product</Text>
            <Text style={styles.inputValue} numberOfLines={1}>
              {selectProduct ? selectProduct.description : 'Choose a product...'}
            </Text>
          </TouchableOpacity>

          {/* Quantity */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Quantity :</Text>
            <View style={styles.quantityRow}>
              <TouchableOpacity 
                onPress={() => handleQuantityChange('minus')}
                style={styles.quantityBtn}>
                <Ionicons name="remove" size={20} color={ThemeColors.Surface} />
              </TouchableOpacity>
              
              <TextInput
                keyboardType="numeric"
                value={String(quantity)}
                onChangeText={txt => setQuantity(Number(txt) || 0)}
                style={styles.quantityInput}
              />
              
              <TouchableOpacity 
                onPress={() => handleQuantityChange('plus')}
                style={styles.quantityBtn}>
                <Ionicons name="add" size={20} color={ThemeColors.Surface} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Price */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Price :</Text>
            <TextInput
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
              placeholder="0"
              style={styles.textInput}
            />
          </View>

          {/* Discount */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Discount :</Text>
            <TextInput
              keyboardType="numeric"
              value={discount}
              onChangeText={setDiscount}
              placeholder="0"
              style={styles.textInput}
            />
          </View>

          {/* Add Item Button */}
          <TouchableOpacity onPress={addToCart} style={styles.addItemBtn}>
            <View style={[styles.gradientBtn, { backgroundColor: ThemeColors.Primary }]}>
              <Text style={styles.btnText}>Add Item</Text>
            </View>
          </TouchableOpacity>

          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>Rs {subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={styles.summaryValue}>Rs {totalDiscount.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, {fontWeight: '700'}]}>Grand Total</Text>
              <Text style={[styles.summaryValue, {fontWeight: '700'}]}>{grandTotal.toFixed(2)}</Text>
            </View>
          </View>

          {/* Confirm order Button */}
          <TouchableOpacity 
            onPress={confirmOrder} 
            disabled={orderLoader}
            style={styles.confirmBtn}>
            <View style={[styles.gradientBtn, { backgroundColor: ThemeColors.Primary }]}>
              {orderLoader ? (
                  <ActivityIndicator color={ThemeColors.Surface} />
              ) : (
                <Text style={styles.btnText}>Confirm order</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Product Selection Modal */}
      <Modal 
        isVisible={ProductModal}
        onBackdropPress={() => setProductModal(false)}
        style={styles.modal}>
        <View style={styles.modalContent}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              placeholder="Search Product"
              value={Search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          </View>
          
          <FlatList
            data={filteredProducts}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity 
                onPress={() => {
                  setSelectProduct(item);
                  setPrice(item.price || '0');
                  setProductModal(false);
                }}
                style={styles.productItem}>
                <Text style={styles.productName}>{item.description}</Text>
                <Text style={styles.productCode}>{item.item_code}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default HCMOrderForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.Surface,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: ThemeColors.Surface,
    fontSize: 18,
    fontWeight: '700',
  },
  badgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: 'red',
    position: 'absolute',
    top: -5,
    right: -5,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  badgeText: {
    color: ThemeColors.Surface,
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: ThemeColors.Surface,
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputContainer: {
    backgroundColor: ThemeColors.Surface,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  label: {
    color: ThemeColors.TextMain,
    fontSize: 14,
    fontWeight: '600',
  },
  inputValue: {
    color: ThemeColors.TextMuted,
    fontSize: 14,
    width: '60%',
    textAlign: 'right',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityBtn: {
    backgroundColor: ThemeColors.Primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityInput: {
    color: ThemeColors.TextMain,
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 15,
    textAlign: 'center',
    minWidth: 30,
  },
  textInput: {
    flex: 1,
    textAlign: 'right',
    color: ThemeColors.TextMain,
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 0,
    marginLeft: 10,
  },
  addItemBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  gradientBtn: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: ThemeColors.Surface,
    fontWeight: '700',
    fontSize: 14,
  },
  summaryCard: {
    backgroundColor: ThemeColors.Surface,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#444',
  },
  summaryValue: {
    fontSize: 14,
    color: ThemeColors.TextMain,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  confirmBtn: {
    width: '100%',
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: ThemeColors.Surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '70%',
    padding: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 45,
    marginLeft: 10,
    color: ThemeColors.TextMain,
  },
  productItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productName: {
    fontSize: 15,
    color: ThemeColors.TextMain,
    fontWeight: '600',
  },
  productCode: {
    fontSize: 12,
    color: ThemeColors.TextMuted,
    marginTop: 2,
  },
});