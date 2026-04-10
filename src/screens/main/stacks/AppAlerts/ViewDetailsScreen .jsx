import React from 'react';
import {
  View,
  ScrollView,
  Animated,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleHeader from '../../../../components/SimpleHeader';
import AppText from '../../../../components/AppText';
import {formatDateString} from '../../../../utils/DateUtils';
import {formatNumber} from '../../../../utils/NumberUtils';
import {ThemeColors} from '../../../../config/Theme';

const decode = text => {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
};

const ViewDetailsScreen = ({route}) => {
  const {viewData, screenType} = route.params;
  const header = viewData?.data_header?.[0];
  const details = viewData?.data_detail || [];

  const isSaleOrder =
    screenType === 'so_approval' ||
    header?.type?.toLowerCase().includes('sale order');

  const isDeliveryNote =
    screenType === 'delivery_approval' ||
    header?.type?.toLowerCase().includes('delivery');

  const isPurchaseOrder =
    screenType === 'po_approval' ||
    header?.type?.toLowerCase().includes('purchase order');

  const isGRN =
    screenType === 'grn_approval' ||
    header?.type?.toLowerCase().includes('grn') ||
    header?.type?.toLowerCase().includes('goods receive');

  const showCustomerPO = isSaleOrder || isDeliveryNote;
  const dateLabel = isPurchaseOrder
    ? 'Cost center:'
    : isSaleOrder
    ? 'Required:'
    : isGRN
    ? null
    : 'Valid till:';
  const [showTermsModal, setShowTermsModal] = React.useState(false);
  console.log('viewData: ', viewData);
  console.log('header: ', route);

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

  // Check if no data is available
  const hasData = header || details.length > 0;

  if (!hasData) {
    return (
      <View style={styles.container}>
        <SimpleHeader title="View Details" />
        <View style={styles.noDataContainer}>
          <Animated.View
            style={[
              styles.noDataContent,
              {
                opacity: fadeAnim,
                transform: [{translateY: slideAnim}],
              },
            ]}>
            <Icon name="database-off" size={80} color="#666" />
            <AppText
              title="No Data Available"
              titleSize={3}
              titleColor="#333"
              titleWeight
              style={styles.noDataTitle}
            />
            <AppText
              title="There are no details available to display."
              titleSize={2}
              titleColor="#666"
              style={styles.noDataSubtitle}
            />
            <AppText
              title="Please check if the transaction exists or try again later."
              titleSize={1.8}
              titleColor="#666"
              style={styles.noDataMessage}
            />
          </Animated.View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SimpleHeader title="View Details" />
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
              {/* Use Type as Heading */}
              <AppText
                title={header.type || 'Header Information'}
                titleSize={3}
                titleColor={ThemeColors.TextMain}
                titleWeight
                style={styles.cardTitle}
              />

              <View style={styles.detailsGrid}>
                <View style={styles.detailRow}>
                  <AppText
                    title="Date:"
                    titleSize={2}
                    titleColor={ThemeColors.TextMain}
                  />
                  <AppText
                    title={formatDateString(header.trans_date) || 'N/A'}
                    titleSize={2}
                    titleColor={ThemeColors.TextMain}
                  />
                </View>
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

                {(isSaleOrder || isGRN) && (
                  <View style={styles.detailRow}>
                    <AppText
                      title="Cost center:"
                      titleSize={2}
                      titleColor={ThemeColors.TextMain}
                    />
                    <AppText
                      title={header.location_name || 'N/A'}
                      titleSize={2}
                      titleColor={ThemeColors.TextMain}
                    />
                  </View>
                )}
                {dateLabel && (
                  <View style={styles.detailRow}>
                    <AppText
                      title={dateLabel}
                      titleSize={2}
                      titleColor={ThemeColors.TextMain}
                    />
                    <AppText
                      title={
                        isPurchaseOrder
                          ? header.location_name || 'N/A'
                          : formatDateString(header.due_date) || 'N/A'
                      }
                      titleSize={2}
                      titleColor={ThemeColors.TextMain}
                    />
                  </View>
                )}

                <View style={{marginTop: 10}}>
                  <AppText
                    title={
                      isPurchaseOrder || isGRN ? 'Supplier Name:' : 'Customer:'
                    }
                    titleSize={2}
                    titleColor={ThemeColors.TextMain}
                    titleWeight
                  />
                  <AppText
                    title={decode(header.name) || 'N/A'}
                    titleSize={2}
                    titleColor={ThemeColors.TextMain}
                    style={{marginTop: 2}}
                  />
                </View>

                {showCustomerPO && (
                  <View style={{marginTop: 10}}>
                    <AppText
                      title="Customer PO:"
                      titleSize={2}
                      titleColor={ThemeColors.TextMain}
                      titleWeight
                    />
                    <AppText
                      title={decode(header.customer_ref) || 'N/A'}
                      titleSize={2}
                      titleColor={ThemeColors.TextMain}
                      style={{marginTop: 2}}
                    />
                  </View>
                )}
                {/* <View style={styles.detailRow}>
                  <AppText
                    title="Location:"
                    titleSize={2}
                    titleColor={ThemeColors.TextMain}
                  />
                  <AppText
                    title={header.location_name || 'N/A'}
                    titleSize={2}
                    titleColor={ThemeColors.TextMain}
                  />
                </View> */}

                {!isPurchaseOrder && !isGRN && (
                  <View style={styles.detailRow}>
                    <AppText
                      title="Sales person:"
                      titleSize={2}
                      titleColor={ThemeColors.TextMain}
                    />
                    <AppText
                      title={header.salesman || 'N/A'}
                      titleSize={2}
                      titleColor={ThemeColors.TextMain}
                    />
                  </View>
                )}

                {!isGRN && (
                  <View style={styles.detailRow}>
                    <AppText
                      title="Payment Terms:"
                      titleSize={2}
                      titleColor={ThemeColors.TextMain}
                    />
                    <AppText
                      title={header.payment_terms || 'N/A'}
                      titleSize={2}
                      titleColor={ThemeColors.TextMain}
                    />
                  </View>
                )}

                <View style={[styles.detailRow, styles.totalRow]}>
                  <AppText
                    title="Total Amount:"
                    titleSize={2}
                    titleColor={ThemeColors.TextMain}
                    titleWeight
                  />
                  <AppText
                    title={formatNumber(header.total) || '0'}
                    titleSize={2}
                    titleColor={ThemeColors.TextMain}
                    titleWeight
                  />
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Items Details Card */}
        {details.length > 0 && (
          <View style={{marginTop: 10}}>
            <AppText
              title={`Line items (${details.length})`}
              titleSize={3}
              titleColor={ThemeColors.TextMain}
              titleWeight
              style={{marginBottom: 15, marginLeft: 5}}
            />

            {details.map((item, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.cardWrapper,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: Animated.multiply(slideAnim, 0.5),
                      },
                    ],
                    marginBottom: 15,
                  },
                ]}>
                <View style={styles.card}>
                  <View style={styles.itemDetails}>
                      <View style={styles.detailRow}>
                        <AppText
                          title="Serial No:"
                          titleSize={2}
                          titleColor={ThemeColors.TextMain}
                        />
                        <AppText
                          title={`${index + 1}`}
                          titleSize={2}
                          titleColor={ThemeColors.TextMain}
                        />
                      </View>
                      <View style={styles.detailRow}>
                        <AppText
                          title="Stock ID:"
                          titleSize={2}
                          titleColor={ThemeColors.TextMain}
                        />
                        <AppText
                          title={item.stock_id || 'N/A'}
                          titleSize={2}
                          titleColor={ThemeColors.TextMain}
                        />
                      </View>

                      {/* Combined Qty, Unit Price, and Total in one row */}
                      <View style={styles.combinedRow}>
                        <View style={[styles.combinedItem, {flex: 0.7}]}>
                          <AppText
                            title="Qty"
                            titleSize={1.6}
                            titleColor={ThemeColors.TextMain}
                            titleWeight
                          />
                          <AppText
                            title={formatNumber(item.quantity)}
                            titleSize={1.8}
                            titleColor={ThemeColors.TextMain}
                          />
                        </View>
                        <View style={[styles.combinedItem, {flex: 1.3}]}>
                          <AppText
                            title="Unit Price"
                            titleSize={1.6}
                            titleColor={ThemeColors.TextMain}
                            titleWeight
                          />
                          <AppText
                            title={formatNumber(item.unit_price)}
                            titleSize={1.8}
                            titleColor={ThemeColors.TextMain}
                          />
                        </View>
                        <View style={[styles.combinedItem, {flex: 1}]}>
                          <AppText
                            title="Total"
                            titleSize={1.6}
                            titleColor={ThemeColors.TextMain}
                            titleWeight
                          />
                          <AppText
                            title={formatNumber(
                              parseFloat(item.quantity || 0) *
                                parseFloat(item.unit_price || 0),
                            )}
                            titleSize={1.8}
                            titleColor={ThemeColors.TextMain}
                          />
                        </View>
                      </View>

                      {/* Long Description */}
                      {item.long_description && (
                        <View style={styles.longDescSection}>
                          <AppText
                            title="Description:"
                            titleSize={2}
                            titleColor={ThemeColors.TextMain}
                            titleWeight
                          />
                          <AppText
                            title={decode(item.long_description)}
                            titleSize={2}
                            titleColor={ThemeColors.TextMain}
                            style={styles.longDescText}
                          />
                        </View>
                      )}
                    </View>
                </View>
              </Animated.View>
            ))}
          </View>
        )}

        {/* Comments Section */}
        {header.comments && (
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
                title="Comments:"
                titleSize={2}
                titleColor={ThemeColors.TextMain}
                titleWeight
              />
              <AppText
                title={decode(header.comments)}
                titleSize={2}
                titleColor={ThemeColors.TextMain}
                style={styles.commentsText}
              />
            </View>
          </Animated.View>
        )}

        {/* Terms & Conditions Button */}
        {header.term_cond && (
          <TouchableOpacity
            style={styles.termsButton}
            onPress={() => setShowTermsModal(true)}
            activeOpacity={0.8}>
            <View style={styles.termsButtonGradient}>
              <Icon
                name="file-document-outline"
                size={24}
                color={ThemeColors.Primary}
              />
              <AppText
                title="View Terms & Conditions"
                titleSize={2}
                titleColor={ThemeColors.TextMain}
                titleWeight
              />
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Terms & Conditions Modal */}
      <Modal
        visible={showTermsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTermsModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <AppText
                title="Terms & Conditions"
                titleSize={2.5}
                titleColor={ThemeColors.TextMain}
                titleWeight
              />
              <TouchableOpacity onPress={() => setShowTermsModal(false)}>
                <Icon name="close" size={28} color="#FFF" />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={true}>
              <AppText
                title={header.term_cond}
                titleSize={2}
                titleColor={ThemeColors.TextMain}
                style={styles.modalTermsText}
              />
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowTermsModal(false)}
              activeOpacity={0.7}>
              <AppText
                title="Close"
                titleSize={2}
                titleColor={ThemeColors.TextMain}
                titleWeight
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
  // No Data Styles
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataTitle: {
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  noDataSubtitle: {
    marginBottom: 10,
    textAlign: 'center',
    opacity: 0.9,
  },
  noDataMessage: {
    textAlign: 'center',
    opacity: 0.8,
    paddingHorizontal: 20,
  },
  // Existing Styles
  cardWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
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
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalRow: {
    marginTop: 5,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.Border,
  },
  divider: {
    height: 1,
    backgroundColor: ThemeColors.Border,
    marginVertical: 12,
  },
  section: {
    marginTop: 5,
  },
  commentsText: {
    marginTop: 4,
    fontStyle: 'italic',
  },
  termsText: {
    marginTop: 4,
    lineHeight: 18,
  },
  itemCard: {
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  itemGradient: {
    padding: 15,
    backgroundColor: ThemeColors.Background,
    borderRadius: 12,
  },
  itemDetails: {
    gap: 6,
  },
  combinedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  combinedItem: {
    flex: 1,
    gap: 0,
    paddingHorizontal: 5,
  },
  longDescSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.Border,
  },
  longDescText: {
    marginTop: 4,
    lineHeight: 16,
  },
  // Modal & Button Styles
  termsButton: {
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  termsButtonText: {
    padding: 18,
    backgroundColor: ThemeColors.Surface,
    borderWidth: 1,
    borderColor: ThemeColors.Primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '100%',
    backgroundColor: ThemeColors.Surface,
    borderRadius: 25,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.Border,
  },
  modalScroll: {
    marginBottom: 20,
  },
  modalTermsText: {
    lineHeight: 24,
    opacity: 0.9,
  },
  closeButton: {
    backgroundColor: ThemeColors.Primary,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
});

export default ViewDetailsScreen;
