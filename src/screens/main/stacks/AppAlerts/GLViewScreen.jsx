import React from 'react';
import {View, ScrollView, Animated} from 'react-native';
import SimpleHeader from '../../../../components/SimpleHeader';
import AppText from '../../../../components/AppText';
import {APPCOLORS} from '../../../../utils/APPCOLORS';
import {ThemeColors} from '../../../../config/Theme';
import {formatNumber} from '../../../../utils/NumberUtils';

const GLViewScreen = ({route}) => {
  const {glData} = route.params;
  const header = glData.data_header?.[0];
  const rawDetails = glData.data_detail || [];
  console.log('glData: ', glData);
  
  // Sort entries: Debits first, then Credits
  const details = [...rawDetails].sort((a, b) => {
    const aIsDebit = a.debit && parseFloat(a.debit) > 0;
    const bIsDebit = b.debit && parseFloat(b.debit) > 0;
    if (aIsDebit && !bIsDebit) return -1;
    if (!aIsDebit && bIsDebit) return 1;
    return 0;
  });
  

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Format amount display
  const formatAmountDisplay = amount => {
    return formatNumber(amount);
  };

  // Format date to dd/mm/yyyy
  const formatDate = dateStr => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    let totalDebit = 0;
    let totalCredit = 0;

    details.forEach(entry => {
      if (entry.debit && parseFloat(entry.debit) > 0) {
        totalDebit += parseFloat(entry.debit);
      }
      if (entry.credit && parseFloat(entry.credit) !== 0) {
        totalCredit += Math.abs(parseFloat(entry.credit));
      }
    });

    return {totalDebit, totalCredit};
  };

  const {totalDebit, totalCredit} = calculateTotals();

  return (
    <View style={styles.container}>
      <SimpleHeader title="General Ledger View" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header Information Card */}
        {header && (
          <Animated.View
            style={[
              styles.cardWrapper,
              {
                opacity: fadeAnim,
                transform: [{translateY: slideAnim}],
              },
            ]}>
            <View style={styles.card}>
              <AppText
                title="Transaction Information"
                titleSize={3}
                titleColor={ThemeColors.TextMain}
                titleWeight
                style={styles.cardTitle}
              />

              <View style={styles.detailsGrid}>
                <View style={styles.detailRow}>
                  <AppText
                    title="Reference:"
                    titleSize={2}
                    titleColor={ThemeColors.TextMain}
                  />
                  <AppText
                    title={header.reference || 'N/A'}
                    titleSize={2}
                    titleColor={ThemeColors.TextMain}
                  />
                </View>

                <View style={styles.detailRow}>
                  <AppText
                    title="Date:"
                    titleSize={2}
                    titleColor={ThemeColors.TextMain}
                  />
                  <AppText
                    title={formatDate(header.trans_date)}
                    titleSize={2}
                    titleColor={ThemeColors.TextMain}
                  />
                </View>

                <View style={styles.detailRow}>
                  <AppText
                    title="Party Name:"
                    titleSize={2}
                    titleColor={ThemeColors.TextMain}
                  />
                  <AppText
                    title={header.name || 'N/A'}
                    titleSize={2}
                    titleColor={ThemeColors.TextMain}
                  />
                </View>

                <View style={styles.detailRow}>
                  <AppText
                    title="Prepared By:"
                    titleSize={2}
                    titleColor={ThemeColors.TextMain}
                  />
                  <AppText
                    title={header.real_name || 'Administrator'}
                    titleSize={2}
                    titleColor={ThemeColors.TextMain}
                  />
                </View>

                {/* Conditional Instrument No & Date - Only show if cheque_no exists */}
                {header.cheque_no != "0" && (
                  <>
                    <View style={styles.detailRow}>
                      <AppText
                        title="Instrument No"
                        titleSize={2}
                        titleColor={ThemeColors.TextMain}
                      />
                      <AppText
                        title={header.cheque_no || 'N/A'}
                        titleSize={2}
                        titleColor={ThemeColors.TextMain}
                      />
                    </View>
                    {header.cheque_date && (
                      <View style={styles.detailRow}>
                        <AppText
                          title="Instrument Date"
                          titleSize={2}
                          titleColor={ThemeColors.TextMain}
                        />
                        <AppText
                          title={formatDate(header.cheque_date)}
                          titleSize={2}
                          titleColor={ThemeColors.TextMain}
                        />
                      </View>
                    )}
                  </>
                )}
              </View>
            </View>
          </Animated.View>
        )}

        {/* GL Entries Card */}
        {details.length > 0 && (
          <Animated.View
            style={[
              styles.cardWrapper,
              {
                opacity: fadeAnim,
                transform: [{translateY: slideAnim}],
              },
            ]}>
            <View style={styles.card}>
              <AppText
                title={`GL Entries (${details.length})`}
                titleSize={3}
                titleColor={ThemeColors.TextMain}
                titleWeight
                style={styles.cardTitle}
              />

              {details.map((entry, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.entryCard,
                    {
                      opacity: fadeAnim,
                      transform: [
                        {
                          translateY: Animated.multiply(slideAnim, 0.5),
                        },
                      ],
                    },
                  ]}>
                  <View style={styles.entryGradient}>
                    {/* Serial Number Badge */}
                    <View style={styles.serialBadge}>
                      <AppText
                        title={`${index + 1}`}
                        titleSize={1.6}
                        titleColor={ThemeColors.TextMain}
                        titleWeight
                      />
                    </View>
                    <View style={styles.entryDetails}>
                      {/* Account Code + Account Name in one line */}
                      <View style={styles.accountRow}>
                        <AppText
                          title={`${entry.account || 'N/A'} - ${entry.account_name || 'N/A'}`}
                          titleSize={2}
                          titleColor={ThemeColors.TextMain}
                          style={styles.accountNameWrap}
                        />
                      </View>
                      {/* Amounts Row */}
                      <View style={styles.amountsRow}>
                        {entry.debit && parseFloat(entry.debit) > 0 && (
                          <View style={styles.amountItem}>
                            <AppText
                              title="Debit:"
                              titleSize={2}
                              titleColor={ThemeColors.TextMain}
                              titleWeight
                            />
                            <AppText
                              title={formatAmountDisplay(entry.debit)}
                              titleSize={2}
                              titleColor={ThemeColors.TextMain}
                              titleWeight
                            />
                          </View>
                        )}

                        {entry.credit && parseFloat(entry.credit) !== 0 && (
                          <View style={styles.amountItem}>
                            <AppText
                              title="Credit:"
                              titleSize={2}
                              titleColor={ThemeColors.TextMain}
                              titleWeight
                            />
                            <AppText
                              title={formatAmountDisplay(entry.credit)}
                              titleSize={2}
                              titleColor={ThemeColors.TextMain}
                              titleWeight
                            />
                          </View>
                        )}
                      </View>

                      {/* Memo */}
                      {entry.memo_ &&
                        entry.memo_ !== '0' &&
                        entry.memo_.trim() !== '' && (
                          <View style={styles.memoSection}>
                            <AppText
                              title={entry.memo_}
                              titleSize={2}
                              titleColor={ThemeColors.TextMain}
                              style={styles.memoText}
                            />
                          </View>
                        )}

                    </View>
                  </View>
                </Animated.View>
              ))}

              {/* Totals Section */}
              <View style={styles.totalsSection}>
                <View style={styles.totalItem}>
                  <AppText
                    title="Total Debit:"
                    titleSize={2.2}
                    titleColor={ThemeColors.TextMain}
                    titleWeight
                  />
                  <AppText
                    title={formatAmountDisplay(totalDebit)}
                    titleSize={2.2}
                    titleColor={ThemeColors.TextMain}
                    titleWeight
                  />
                </View>
                <View style={styles.totalItem}>
                  <AppText
                    title="Total Credit:"
                    titleSize={2.2}
                    titleColor={ThemeColors.TextMain}
                    titleWeight
                  />
                  <AppText
                    title={formatAmountDisplay(totalCredit)}
                    titleSize={2.2}
                    titleColor={ThemeColors.TextMain}
                    titleWeight
                  />
                </View>
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: ThemeColors.Surface,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  cardWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: APPCOLORS.BLACK,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  card: {
    padding: 20,
    backgroundColor: ThemeColors.Surface,
    borderRadius: 20,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 15,
  },
  detailsGrid: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryCard: {
    marginBottom: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  entryGradient: {
    padding: 10,
    backgroundColor: ThemeColors.Background,
    borderRadius: 10,
    position: 'relative',
  },
  serialBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: ThemeColors.Primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryNumber: {
    textAlign: 'center',
    marginBottom: 6,
  },
  entryDetails: {
    gap: 4,
    paddingRight: 35,
  },
  accountRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  accountNameWrap: {
    flexWrap: 'wrap',
    flex: 1,
  },
  accountName: {
    flex: 1,
    textAlign: 'right',
    flexWrap: 'wrap',
  },
  amountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.Border,
  },
  amountItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  memoSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.Border,
  },
  memoText: {
    marginTop: 4,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  totalsSection: {
    marginTop: 15,
  },
  divider: {
    height: 1,
    backgroundColor: ThemeColors.Border,
    marginBottom: 12,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
};

export default GLViewScreen;
