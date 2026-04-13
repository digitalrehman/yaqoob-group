import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import SimpleHeader from '../../../../components/SimpleHeader';
import {ThemeColors} from '../../../../config/Theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppText from '../../../../components/AppText';
import * as Animatable from 'react-native-animatable';
import {responsiveWidth} from '../../../../utils/Responsive';

const ManagementControls = () => {
  const [acceleratorEnabled, setAcceleratorEnabled] = useState(false);
  const [rate1, setRate1] = useState(40);
  const [rate2, setRate2] = useState(60);

  const quickActions = [
    {name: 'Update Salary', icon: 'account-cash'},
    {name: 'Add Bonus', icon: 'plus-circle'},
    {name: 'Approve Leaves', icon: 'calendar-check'},
    {name: 'Set Target', icon: 'target'},
    {name: 'Adjust Deduction', icon: 'minus-network'},
    {name: 'Lock Month', icon: 'lock-clock'},
  ];

  const handleSliderPress = (e, setRate) => {
    const {locationX} = e.nativeEvent;
    const newRate = Math.min(
      100,
      Math.max(0, (locationX / (responsiveWidth(100) - 64)) * 100),
    );
    setRate(newRate);
  };

  const leaveRequests = [
    {type: 'Leave Approval', phime: 'Phime', vedpe: 'Vedpe', amount: '2500'},
    {type: 'Pending leaves', phime: '10,mm', vedpe: '2,900', amount: '3500'},
  ];
  const expenseRequests = [
    {type: 'Expense Approval', phime: 'Phime', vedpe: 'Vedpe', amount: '2500'},
    {type: 'Pending Expenses', phime: '10,mm', vedpe: '2,900', amount: '3500'},
  ];

  const loanAndAdvanceRequests = [
    {type: 'Loan Approval', phime: 'Phime', vedpe: 'Vedpe', amount: '2500'},
    {type: 'Pending Loans', phime: '10,mm', vedpe: '2,900', amount: '3500'},
    {type: 'Advance Approval', phime: 'Phime', vedpe: 'Vedpe', amount: '2500'},
    {type: 'Pending Advances', phime: '10,mm', vedpe: '2,900', amount: '3500'},
  ];

  return (
    <View style={styles.container}>
      <SimpleHeader title="Management Controls" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Quick Actions Row */}
        <View style={styles.sectionHeader}>
          <AppText
            title="Quick Actions"
            titleSize={2}
            titleWeight
            titleColor={ThemeColors.TextMain}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickActionScroll}>
          {quickActions.map((action, idx) => (
            <TouchableOpacity key={idx} style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Icon
                  name={action.icon}
                  size={22}
                  color={ThemeColors.Primary}
                />
              </View>
              <Text style={styles.actionText}>{action.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Profile & Commission Section */}
        <View style={styles.row}>
          {/* Profile Card */}
          <View style={[styles.card, {flex: 1.2}]}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarPlaceholder}>
                <Icon name="account" size={40} color={ThemeColors.TextMuted} />
              </View>
              <TouchableOpacity style={styles.editBtn}>
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Base Salary</Text>
            <View style={styles.salaryPicker}>
              <Text style={styles.salaryText}>Rs. 50,000</Text>
              <Icon
                name="chevron-down"
                size={20}
                color={ThemeColors.TextMuted}
              />
            </View>
          </View>

          {/* Commission Preview Card */}
          <View style={[styles.card, {flex: 1}]}>
            <View style={styles.statusBadge}>
              <View style={styles.dot} />
              <Text style={styles.statusText}>Active</Text>
            </View>
            <Text style={styles.label}>Net Payable Preview</Text>
            <Text style={styles.payPreview}>Rs. 1,11,667</Text>
            <View style={styles.spacer} />
          </View>
        </View>

        {/* Simulator Alert */}
        <Animatable.View
          animation="pulse"
          iterationCount="infinite"
          style={styles.simulatorCard}>
          <View style={styles.simulatorContent}>
            <Icon name="alert-decagram-outline" size={24} color="#FFF" />
            <View>
              <Text style={styles.simulatorTitle}>What-if Simulator</Text>
              <Text style={styles.simulatorSub}>
                Commission Exceeding - Extra Bonus Option
              </Text>
            </View>
          </View>
          <Icon name="alert-outline" size={20} color="#FFF" />
        </Animatable.View>

        {/* Commission Sliders */}
        <View style={styles.card}>
          <AppText
            title="Commission Controls"
            titleSize={1.8}
            titleWeight
            titleColor={ThemeColors.TextMain}
          />

          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>Primary Rate:</Text>
              <Text style={styles.sliderValue}>{Math.round(rate1)}% Edit</Text>
            </View>
            <TouchableOpacity
              activeOpacity={1}
              onPress={e => handleSliderPress(e, setRate1)}
              style={styles.sliderLine}>
              <View style={[styles.sliderProgress, {width: `${rate1}%`}]} />
              <View style={[styles.sliderThumb, {left: `${rate1}%`}]} />
            </TouchableOpacity>
          </View>

          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>Accelerator Rate:</Text>
              <Text style={styles.sliderValue}>{Math.round(rate2)}% Edit</Text>
            </View>
            <TouchableOpacity
              activeOpacity={1}
              onPress={e => handleSliderPress(e, setRate2)}
              style={styles.sliderLine}>
              <View
                style={[
                  styles.sliderProgress,
                  {backgroundColor: '#2ECC71', width: `${rate2}%`},
                ]}
              />
              <View style={[styles.sliderThumb, {left: `${rate2}%`}]} />
            </TouchableOpacity>
          </View>

          <View style={styles.acceleratorContainer}>
            <Text style={styles.sliderLabel}>Apply Accelerator</Text>
            <Switch
              value={acceleratorEnabled}
              onValueChange={setAcceleratorEnabled}
              trackColor={{false: '#E2E8F0', true: ThemeColors.Primary}}
              thumbColor="#FFF"
            />
          </View>
        </View>

        {/* Attendance & Leave Table */}
        <View style={[styles.card, {padding: 0}]}>
          <View style={styles.tableHeader}>
            <AppText
              title="Attendance"
              titleSize={1.8}
              titleWeight
              titleColor={ThemeColors.TextMain}
            />
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, {backgroundColor: '#2ECC71'}]}>
                <Text style={styles.toggleText}>Present</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, {backgroundColor: '#E74C3C'}]}>
                <Text style={styles.toggleText}>Absent</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tableBody}>
            {leaveRequests.map((req, idx) => (
              <View key={idx} style={styles.tableRow}>
                <View style={{flex: 1.5}}>
                  <Text style={styles.rowType}>{req.type}</Text>
                </View>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.tableActionBtn}>
                    <Text style={[styles.tableActionText, {color: '#2ECC71'}]}>
                      Approve
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.tableActionBtn}>
                    <Text style={[styles.tableActionText, {color: '#E74C3C'}]}>
                      Reject
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Expense Table */}
        <View style={[styles.card, {padding: 0}]}>
          <View style={styles.tableHeader}>
            <AppText
              title="Expense"
              titleSize={1.8}
              titleWeight
              titleColor={ThemeColors.TextMain}
            />
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, {backgroundColor: '#2ECC71'}]}>
                <Text style={styles.toggleText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, {backgroundColor: '#E74C3C'}]}>
                <Text style={styles.toggleText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tableBody}>
            {expenseRequests.map((req, idx) => (
              <View key={idx} style={styles.tableRow}>
                <View style={{flex: 1.5}}>
                  <Text style={styles.rowType}>{req.type}</Text>
                </View>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.tableActionBtn}>
                    <Text style={[styles.tableActionText, {color: '#2ECC71'}]}>
                      Approve
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.tableActionBtn}>
                    <Text style={[styles.tableActionText, {color: '#E74C3C'}]}>
                      Reject
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Loan and Advance Table */}
        <View style={[styles.card, {padding: 0}]}>
          <View style={styles.tableHeader}>
            <AppText
              title="Loan and Advance"
              titleSize={1.8}
              titleWeight
              titleColor={ThemeColors.TextMain}
            />
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, {backgroundColor: '#2ECC71'}]}>
                <Text style={styles.toggleText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, {backgroundColor: '#E74C3C'}]}>
                <Text style={styles.toggleText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tableBody}>
            {loanAndAdvanceRequests.map((req, idx) => (
              <View key={idx} style={styles.tableRow}>
                <View style={{flex: 1.5}}>
                  <Text style={styles.rowType}>{req.type}</Text>
                </View>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.tableActionBtn}>
                    <Text style={[styles.tableActionText, {color: '#2ECC71'}]}>
                      Approve
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.tableActionBtn}>
                    <Text style={[styles.tableActionText, {color: '#E74C3C'}]}>
                      Reject
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{height: 40}} />
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
  sectionHeader: {
    marginBottom: 12,
  },
  quickActionScroll: {
    marginBottom: 20,
  },
  actionItem: {
    backgroundColor: ThemeColors.Surface,
    width: 90,
    height: 90,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  actionIcon: {
    backgroundColor: 'rgba(232,127,36,0.1)',
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 10,
    color: ThemeColors.TextMain,
    textAlign: 'center',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  card: {
    backgroundColor: ThemeColors.Surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  editBtn: {
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2ECC71',
  },
  editBtnText: {
    color: '#2ECC71',
    fontSize: 11,
    fontWeight: '700',
  },
  label: {
    fontSize: 12,
    color: ThemeColors.TextMuted,
    marginBottom: 6,
    fontWeight: '500',
  },
  salaryPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  salaryText: {
    fontSize: 14,
    color: ThemeColors.TextMain,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2ECC71',
  },
  statusText: {
    fontSize: 12,
    color: ThemeColors.TextMuted,
    fontWeight: '600',
  },
  payPreview: {
    fontSize: 20,
    fontWeight: '700',
    color: ThemeColors.Primary,
  },
  spacer: {
    height: 20,
  },
  simulatorCard: {
    backgroundColor: '#E67E22',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  simulatorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  simulatorTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  simulatorSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
  },
  sliderContainer: {
    marginTop: 20,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 13,
    color: ThemeColors.TextMuted,
    fontWeight: '500',
  },
  sliderValue: {
    fontSize: 13,
    color: ThemeColors.TextMain,
    fontWeight: '700',
  },
  sliderLine: {
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    position: 'relative',
  },
  sliderProgress: {
    height: '100%',
    width: '40%',
    backgroundColor: ThemeColors.Primary,
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    left: '40%',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 2,
    borderColor: ThemeColors.Primary,
  },
  acceleratorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  toggleText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  tableBody: {
    padding: 16,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  rowType: {
    fontSize: 14,
    color: ThemeColors.TextMain,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tableActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tableActionText: {
    fontSize: 11,
    fontWeight: '700',
  },
});

export default ManagementControls;
