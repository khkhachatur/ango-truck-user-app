import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';

const DROPDOWN_HEIGHT = 165;

interface Props {
  navigation?: any;
}

interface Route {
  id: string;
  fromCity: string;
  toCity: string;
  fromDate: string;
  toDate: string;
  progress: number;
  truckSize: string;
  weight: string;
  price: string;
  status: string;
}

const ALL_ROUTES: Route[] = [
  { id: '1',  fromCity: 'Luanda',   toCity: 'Benguela',   fromDate: 'Jun 11', toDate: 'Jun 12', progress: 0.95, truckSize: 'L - Rigid Truck',    weight: '6,500 kg',  price: 'Kz 9.750 mil',  status: 'In Transit - Driver Assigned' },
  { id: '2',  fromCity: 'Benguela', toCity: 'Luanda',     fromDate: 'Jun 10', toDate: 'Jun 11', progress: 0.80, truckSize: 'M - Box Truck',       weight: '2,200 kg',  price: 'Kz 5.250 mil',  status: 'In Transit - On Route' },
  { id: '3',  fromCity: 'Angola',   toCity: 'Namibia',    fromDate: 'Jun 5',  toDate: 'Jun 13', progress: 0.55, truckSize: 'XL - Semi-Trailer',   weight: '18,000 kg', price: 'Kz 18.000 mil', status: 'In Transit - Customs Clearance' },
  { id: '4',  fromCity: 'Luanda',   toCity: 'Cabu Ledo',  fromDate: 'Jun 11', toDate: 'Jun 11', progress: 0.90, truckSize: 'S - Pickup',          weight: '800 kg',    price: 'Kz 2.250 mil',  status: 'Delivered' },
  { id: '5',  fromCity: 'Malanje',  toCity: 'Luanda',     fromDate: 'May 28', toDate: 'May 30', progress: 1.00, truckSize: 'M - Box Truck',       weight: '3,100 kg',  price: 'Kz 6.300 mil',  status: 'Delivered' },
  { id: '6',  fromCity: 'Luanda',   toCity: 'Huambo',     fromDate: 'May 20', toDate: 'May 22', progress: 1.00, truckSize: 'L - Rigid Truck',     weight: '7,800 kg',  price: 'Kz 11.700 mil', status: 'Delivered' },
  { id: '7',  fromCity: 'Huíla',    toCity: 'Luanda',     fromDate: 'May 10', toDate: 'May 12', progress: 1.00, truckSize: 'S - Pickup',          weight: '950 kg',    price: 'Kz 2.850 mil',  status: 'Delivered' },
  { id: '8',  fromCity: 'Luanda',   toCity: 'Cabinda',    fromDate: 'Apr 30', toDate: 'May 2',  progress: 1.00, truckSize: 'XL - Semi-Trailer',   weight: '22,000 kg', price: 'Kz 24.000 mil', status: 'Delivered' },
];

export default function ShippingHistoryScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shipping History</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {ALL_ROUTES.map((r) => (
          <RouteCard key={r.id} {...r} />
        ))}
      </ScrollView>
    </View>
  );
}

// ─── RouteCard ────────────────────────────────────────────────────────────────

function RouteCard({ fromCity, toCity, fromDate, toDate, progress, truckSize, weight, price, status }: Route) {
  const [isExpanded, setIsExpanded] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isExpanded ? 1 : 0,
      duration: 280,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  const dropdownHeight  = anim.interpolate({ inputRange: [0, 1], outputRange: [0, DROPDOWN_HEIGHT] });
  const dropdownOpacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });
  const chevronRotation = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <Pressable style={cardStyles.card} onPress={() => setIsExpanded(!isExpanded)}>
      <View style={cardStyles.cityRow}>
        <Text style={cardStyles.city}>{fromCity}</Text>
        <Text style={cardStyles.city}>{toCity}</Text>
      </View>
      <View style={cardStyles.progressTrack}>
        <View style={[cardStyles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <View style={cardStyles.dateRow}>
        <Text style={cardStyles.date}>{fromDate}</Text>
        <View style={cardStyles.dateRight}>
          <Text style={cardStyles.date}>{toDate}</Text>
          <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
            <ChevronDown size={14} color="#666" />
          </Animated.View>
        </View>
      </View>

      <Animated.View style={[cardStyles.dropdown, { height: dropdownHeight, opacity: dropdownOpacity }]}>
        <View style={cardStyles.dropdownInner}>
          <View style={cardStyles.detailGrid}>
            <View style={cardStyles.detailCell}>
              <Text style={cardStyles.detailLabel}>Truck Size</Text>
              <Text style={cardStyles.detailValue}>{truckSize}</Text>
            </View>
            <View style={cardStyles.detailCell}>
              <Text style={cardStyles.detailLabel}>Cargo Weight</Text>
              <Text style={cardStyles.detailValue}>{weight}</Text>
            </View>
            <View style={cardStyles.detailCell}>
              <Text style={cardStyles.detailLabel}>Price</Text>
              <Text style={cardStyles.detailValue}>{price}</Text>
            </View>
            <View style={cardStyles.detailCell}>
              <Text style={cardStyles.detailLabel}>Status</Text>
              <Text style={cardStyles.detailValue} numberOfLines={1}>{status}</Text>
            </View>
          </View>
          <TouchableOpacity style={cardStyles.trackBtn} activeOpacity={0.7}>
            <Text style={cardStyles.trackBtnText}>Track Shipment</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#121212' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 12 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#121212',
  },
  headerTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14, marginBottom: 8,
    overflow: 'hidden',
  },
  cityRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  city:    { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  progressTrack: { height: 3, backgroundColor: '#2E2E2E', borderRadius: 2, marginBottom: 8 },
  progressFill:  { height: 3, backgroundColor: '#49C593', borderRadius: 2 },
  dateRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateRight:{ flexDirection: 'row', alignItems: 'center', gap: 4 },
  date:     { color: '#666', fontSize: 12 },

  dropdown: { overflow: 'hidden' },
  dropdownInner: {
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
    marginTop: 12,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  detailCell: { width: '47%' },
  detailLabel: { color: '#666', fontSize: 11, marginBottom: 2 },
  detailValue: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },

  trackBtn: {
    borderWidth: 1,
    borderColor: '#49C593',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  trackBtnText: { color: '#49C593', fontSize: 13, fontWeight: '700' },
});
