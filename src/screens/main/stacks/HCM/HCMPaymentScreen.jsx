import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { ThemeColors } from '../../../../config/Theme';

const HCMPaymentScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const customer = route?.params?.customer || {};

  // Form State
  const [paymentType, setPaymentType] = useState('Cash'); // 'Cash' | 'Cheque'
  const [amount, setAmount] = useState('');
  const [cashInHand, setCashInHand] = useState('');
  const [bankName, setBankName] = useState('');
  const [chequeNo, setChequeNo] = useState('');
  const [date, setDate] = useState(new Date());

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const formatDisplayDate = (d) => {
    if (!d) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDone = () => {
    // Process Payment Logic here later
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: Platform.OS === 'ios' ? insets.top + 10 : insets.top + 20,
            paddingBottom: 20,
          },
        ]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={ThemeColors.Surface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Screen</Text>
        <View style={{ width: 26 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setPaymentType('Cash')}
            >
              <Ionicons
                name={paymentType === 'Cash' ? 'radio-button-on' : 'radio-button-off'}
                size={24}
                color={paymentType === 'Cash' ? ThemeColors.Primary : '#777'}
              />
              <Text style={styles.radioLabel}>Cash</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setPaymentType('Cheque')}
            >
              <Ionicons
                name={paymentType === 'Cheque' ? 'radio-button-on' : 'radio-button-off'}
                size={24}
                color={paymentType === 'Cheque' ? ThemeColors.Primary : '#777'}
              />
              <Text style={styles.radioLabel}>Cheque</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>{paymentType}</Text>

          {paymentType === 'Cash' ? (
            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Amount"
                  placeholderTextColor="#A0A0A0"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Cash in Hand"
                  placeholderTextColor="#A0A0A0"
                  value={cashInHand}
                  onChangeText={setCashInHand}
                />
              </View>

              <View style={styles.inputWrapperSmall}>
                <TouchableOpacity
                  style={[styles.input, styles.datePickerBtn]}
                  onPress={() => setDatePickerVisibility(true)}
                >
                  <Text style={styles.dateText}>{formatDisplayDate(date)}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Bank name"
                  placeholderTextColor="#A0A0A0"
                  value={bankName}
                  onChangeText={setBankName}
                />
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Cheque no"
                  placeholderTextColor="#A0A0A0"
                  value={chequeNo}
                  onChangeText={setChequeNo}
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Amount"
                    placeholderTextColor="#A0A0A0"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                  />
                </View>
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <TouchableOpacity
                    style={[styles.input, styles.datePickerBtn]}
                    onPress={() => setDatePickerVisibility(true)}
                  >
                    <Text style={styles.dateText}>{formatDisplayDate(date)}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          <View style={styles.separator} />

          <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={(d) => {
          setDate(d);
          setDatePickerVisibility(false);
        }}
        onCancel={() => setDatePickerVisibility(false)}
      />
    </View>
  );
};

export default HCMPaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.Background || '#F1F9F8',
  },
  header: {
    backgroundColor: ThemeColors.Primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    // Note: borderBottom radius or shadow if needed can go here
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: ThemeColors.Primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    padding: 25,
    paddingTop: 30,
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 35,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 15,
  },
  formContainer: {
    gap: 15,
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  inputWrapperSmall: {
    backgroundColor: '#fff',
    borderRadius: 30,
    width: '48%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  rowInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  datePickerBtn: {
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 35,
  },
  doneBtn: {
    backgroundColor: ThemeColors.Primary,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: ThemeColors.Primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  doneBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
