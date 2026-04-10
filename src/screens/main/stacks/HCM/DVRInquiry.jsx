import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import {useSelector} from 'react-redux';
import axios from 'axios';
import AppText from '../../../../components/AppText';
import {ThemeColors} from '../../../../config/Theme';
import {BASEURL} from '../../../../utils/BaseUrl';
import SimpleHeader from '../../../../components/SimpleHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const {width} = Dimensions.get('window');

const DVRInquiry = () => {
  const userData = useSelector(state => state.Data.currentData);

  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const todayDate = now.getDate();
  const isCurrentlyTodayMonth =
    now.getFullYear() === currentYear && now.getMonth() === currentMonth;

  const [selectedDay, setSelectedDay] = useState(todayDate);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysArray = Array.from(
    {length: getDaysInMonth(currentYear, currentMonth)},
    (_, i) => i + 1,
  );

  useEffect(() => {
    fetchHistory(selectedDay);
  }, [selectedDay, currentMonth, currentYear]);

  const fetchHistory = async day => {
    setLoading(true);
    // Format date as YYYY-MM-DD
    const dateQuery = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      '0',
    )}-${String(day).padStart(2, '0')}`;

    const formData = new FormData();
    formData.append('emp_code', userData?.emp_code || '10001');
    formData.append('date', dateQuery);

    try {
      const response = await axios.post(
        `${BASEURL}get_attendence_detail.php`,
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
        },
      );

      if (response.data.status === 'true' || response.data.status === true) {
        setHistory(response.data.data || []);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.log('Fetch History Error:', error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(1);
  };

  const openMap = (lat, lon) => {
    if (!lat || !lon) return;
    const url = Platform.select({
      ios: `maps:0,0?q=${lat},${lon}`,
      android: `geo:0,0?q=${lat},${lon}`,
    });
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const formatTime12h = timeStr => {
    if (!timeStr) return 'N/A';
    try {
      const [hours, minutes] = timeStr.split(':');
      const h = parseInt(hours);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${h12}:${minutes} ${ampm}`;
    } catch (e) {
      return timeStr;
    }
  };

  return (
    <View style={styles.container}>
      <SimpleHeader title="DVR Inquiry" />

      <ScrollView
        contentContainerStyle={{paddingBottom: 40}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchHistory(selectedDay)}
            colors={[ThemeColors.Primary]}
          />
        }>
        {/* Calendar Picker Section */}
        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={handlePrevMonth} style={styles.navBtn}>
              <FontAwesome
                name="chevron-left"
                size={16}
                color={ThemeColors.Primary}
              />
            </TouchableOpacity>

            <View style={{alignItems: 'center'}}>
              <AppText
                title={`${new Date(currentYear, currentMonth).toLocaleString(
                  'default',
                  {month: 'long'},
                )} ${currentYear}`}
                titleWeight
                titleSize={2}
                titleColor={ThemeColors.Primary}
              />
              <View style={styles.todayIndicator}>
                <View style={styles.todayDot} />
                <AppText
                  title="Month Log"
                  titleSize={1.4}
                  titleColor={ThemeColors.TextMuted}
                />
              </View>
            </View>

            <TouchableOpacity onPress={handleNextMonth} style={styles.navBtn}>
              <FontAwesome
                name="chevron-right"
                size={16}
                color={ThemeColors.Primary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {daysArray.map(day => {
              const isSelected = day === selectedDay;
              const isToday = isCurrentlyTodayMonth && day === todayDate;

              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => setSelectedDay(day)}
                  style={[
                    styles.dayButton,
                    isSelected && styles.selectedButton,
                    !isSelected && isToday && styles.todayOutline,
                  ]}>
                  <AppText
                    title={day.toString()}
                    titleColor={isSelected ? ThemeColors.Surface : ThemeColors.TextMain}
                    titleSize={1.6}
                    titleWeight={isSelected || isToday}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Results Section */}
        <View style={styles.listSection}>
          <AppText
            title={`${selectedDay} ${new Date(
              currentYear,
              currentMonth,
            ).toLocaleString('default', {month: 'long'})} Logs`}
            titleSize={1.8}
            titleWeight
            titleColor={ThemeColors.TextMain}
            style={{marginBottom: 15}}
          />

          {loading && !refreshing ? (
            <ActivityIndicator
              size="large"
              color={ThemeColors.Primary}
              style={{marginTop: 20}}
            />
          ) : history.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome name="calendar-minus-o" size={50} color="#DDD" />
              <AppText
                title="No records found for this date."
                titleSize={1.4}
                titleColor={ThemeColors.TextMuted}
                style={{marginTop: 10}}
              />
            </View>
          ) : (
            history.map((item, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={() => openMap(item.latitude, item.longitude)}
                style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.timeBadge}>
                    <FontAwesome
                      name="clock-o"
                      size={14}
                      color={ThemeColors.Primary}
                    />
                    <AppText
                      title={formatTime12h(item.ActivityTime)}
                      titleSize={1.4}
                      titleWeight
                      titleColor={ThemeColors.Primary}
                      style={{marginLeft: 5}}
                    />
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          item.in_out === '1' ? '#E9F7EF' : '#FEF9E7',
                      },
                    ]}>
                    <AppText
                      title={item.in_out === '1' ? 'Check-Out' : 'Check-In'}
                      titleSize={1.2}
                      titleColor={item.in_out === '1' ? '#28A745' : '#F1C40F'}
                      titleWeight
                    />
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.detailItem}>
                    <FontAwesome
                      name="map-marker"
                      size={16}
                      color={ThemeColors.TextMuted}
                      style={{width: 20}}
                    />
                    <View style={{flex: 1}}>
                      <AppText
                        title={item.site_name || 'Site Recorded'}
                        titleSize={1.4}
                        titleWeight
                        titleColor={ThemeColors.TextMain}
                      />
                      <AppText
                        title={item.site_address || 'Address not provided'}
                        titleSize={1.2}
                        titleColor={ThemeColors.TextMuted}
                        style={{marginTop: 2}}
                      />
                    </View>
                    {(item.latitude || item.longitude) && (
                      <FontAwesome
                        name="external-link"
                        size={12}
                        color={ThemeColors.Primary}
                      />
                    )}
                  </View>

                  {item.nature_of_visit && (
                    <View style={[styles.detailItem, {marginTop: 10}]}>
                      <FontAwesome
                        name="info-circle"
                        size={16}
                        color={ThemeColors.TextMuted}
                        style={{width: 20}}
                      />
                      <AppText
                        title={item.nature_of_visit}
                        titleSize={1.3}
                        titleColor={ThemeColors.TextMain}
                        style={{flex: 1}}
                      />
                    </View>
                  )}

                  {item.current_location && (
                    <View
                      style={[
                        styles.detailItem,
                        {
                          marginTop: 10,
                          borderTopWidth: 0.5,
                          borderTopColor: '#EEE',
                          paddingTop: 8,
                        },
                      ]}>
                      <FontAwesome
                        name="globe"
                        size={16}
                        color={ThemeColors.TextMuted}
                        style={{width: 20}}
                      />
                      <AppText
                        title={item.current_location}
                        titleSize={1.2}
                        titleColor={ThemeColors.TextMuted}
                        style={{flex: 1}}
                      />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default DVRInquiry;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: ThemeColors.Surface},
  calendarContainer: {
    backgroundColor: ThemeColors.Surface,
    margin: 15,
    borderRadius: 20,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  todayIndicator: {flexDirection: 'row', alignItems: 'center'},
  todayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ThemeColors.Primary,
    marginRight: 6,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start'},
  dayButton: {
    width: (width - 70) / 7,
    height: (width - 70) / 7,
    margin: 3,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  selectedButton: {
    backgroundColor: ThemeColors.Primary,
    borderColor: ThemeColors.Primary,
    elevation: 3,
  },
  todayOutline: {
    borderColor: ThemeColors.Primary,
    borderWidth: 1.5,
  },
  listSection: {paddingHorizontal: 15, marginTop: 10},
  card: {
    backgroundColor: ThemeColors.Surface,
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 8,
    marginBottom: 10,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardBody: {paddingHorizontal: 2},
  detailItem: {flexDirection: 'row', alignItems: 'flex-start'},
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
    padding: 20,
  },
});
