import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  FlatList,
  StatusBar,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronDown } from 'lucide-react-native';

interface Props { navigation?: any; }

const DROPDOWN_HEIGHT = 165;

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
  active: boolean;
}

const ROUTES: Route[] = [
  { id: '1', fromCity: 'Luanda',   toCity: 'Benguela',  fromDate: 'Jun 11', toDate: 'Jun 12', progress: 0.95, truckSize: 'L - Rigid Truck',   weight: '6,500 kg',  price: 'Kz 9.750 mil',  status: 'In Transit - Driver Assigned', active: true },
  { id: '2', fromCity: 'Benguela', toCity: 'Luanda',    fromDate: 'Jun 10', toDate: 'Jun 11', progress: 0.80, truckSize: 'M - Box Truck',      weight: '2,200 kg',  price: 'Kz 5.250 mil',  status: 'In Transit - On Route',        active: true },
  { id: '3', fromCity: 'Angola',   toCity: 'Namibia',   fromDate: 'Jun 5',  toDate: 'Jun 13', progress: 0.55, truckSize: 'XL - Semi-Trailer',  weight: '18,000 kg', price: 'Kz 18.000 mil', status: 'Customs Clearance',            active: true },
  { id: '4', fromCity: 'Malanje',  toCity: 'Luanda',    fromDate: 'May 28', toDate: 'May 30', progress: 1.00, truckSize: 'M - Box Truck',      weight: '3,100 kg',  price: 'Kz 6.300 mil',  status: 'Delivered',                    active: false },
  { id: '5', fromCity: 'Luanda',   toCity: 'Huambo',    fromDate: 'May 20', toDate: 'May 22', progress: 1.00, truckSize: 'L - Rigid Truck',    weight: '7,800 kg',  price: 'Kz 11.700 mil', status: 'Delivered',                    active: false },
  { id: '6', fromCity: 'Huíla',    toCity: 'Luanda',    fromDate: 'May 10', toDate: 'May 12', progress: 1.00, truckSize: 'S - Pickup',         weight: '950 kg',    price: 'Kz 2.850 mil',  status: 'Delivered',                    active: false },
  { id: '7', fromCity: 'Luanda',   toCity: 'Cabu Ledo', fromDate: 'Jun 11', toDate: 'Jun 11', progress: 0.90, truckSize: 'S - Pickup',         weight: '800 kg',    price: 'Kz 2.250 mil',  status: 'Delivered',                    active: false },
];

export default function HistoryScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'active' | 'completed'>('active');

  const filtered = ROUTES.filter((r) => r.active === (tab === 'active'));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ChevronLeft size={22} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Shipping History</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Segmented control */}
      <View style={styles.segmentWrap}>
        <View style={styles.segment}>
          <TouchableOpacity
            style={[styles.segBtn, tab === 'active' && styles.segBtnActive]}
            onPress={() => setTab('active')}
          >
            <Text style={[styles.segText, tab === 'active' && styles.segTextActive]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segBtn, tab === 'completed' && styles.segBtnActive]}
            onPress={() => setTab('completed')}
          >
            <Text style={[styles.segText, tab === 'completed' && styles.segTextActive]}>Completed</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <RouteCard {...item} />}
      />
    </View>
  );
}

// ─── RouteCard ────────────────────────────────────────────────────────────────

function RouteCard({ fromCity, toCity, fromDate, toDate, progress, truckSize, weight, price, status }: Route) {
  const [isExpanded, setIsExpanded] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: isExpanded ? 1 : 0, duration: 280, useNativeDriver: false }).start();
  }, [isExpanded]);

  const dropdownHeight  = anim.interpolate({ inputRange: [0, 1], outputRange: [0, DROPDOWN_HEIGHT] });
  const dropdownOpacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });
  const chevronRotation = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <Pressable style={card.wrap} onPress={() => setIsExpanded(!isExpanded)}>
      <View style={card.cityRow}>
        <Text style={card.city}>{fromCity}</Text>
        <Text style={card.city}>{toCity}</Text>
      </View>
      <View style={card.progressTrack}>
        <View style={[card.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <View style={card.dateRow}>
        <Text style={card.date}>{fromDate}</Text>
        <View style={card.dateRight}>
          <Text style={card.date}>{toDate}</Text>
          <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
            <ChevronDown size={14} color="#666" />
          </Animated.View>
        </View>
      </View>
      <Animated.View style={[card.dropdown, { height: dropdownHeight, opacity: dropdownOpacity }]}>
        <View style={card.dropdownInner}>
          <View style={card.detailGrid}>
            <View style={card.detailCell}><Text style={card.detailLabel}>Truck Size</Text><Text style={card.detailValue}>{truckSize}</Text></View>
            <View style={card.detailCell}><Text style={card.detailLabel}>Cargo Weight</Text><Text style={card.detailValue}>{weight}</Text></View>
            <View style={card.detailCell}><Text style={card.detailLabel}>Price</Text><Text style={card.detailValue}>{price}</Text></View>
            <View style={card.detailCell}><Text style={card.detailLabel}>Status</Text><Text style={card.detailValue} numberOfLines={1}>{status}</Text></View>
          </View>
          <TouchableOpacity style={card.trackBtn} activeOpacity={0.7}>
            <Text style={card.trackBtnText}>Track Shipment</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root:       { flex: 1, backgroundColor: '#121212' },
  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12 },
  backBtn:    { flexDirection: 'row', alignItems: 'center', minWidth: 70 },
  backText:   { color: '#FFFFFF', fontSize: 15, marginLeft: 2 },
  title:      { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  list:       { paddingHorizontal: 16, paddingTop: 12 },

  segmentWrap: { paddingHorizontal: 16, marginBottom: 4 },
  segment: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 4,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 9,
  },
  segBtnActive: { backgroundColor: '#49C593' },
  segText:      { color: '#888', fontSize: 14, fontWeight: '600' },
  segTextActive:{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});

const card = StyleSheet.create({
  wrap:          { backgroundColor: '#1A1A1A', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 8, overflow: 'hidden' },
  cityRow:       { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  city:          { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  progressTrack: { height: 3, backgroundColor: '#2E2E2E', borderRadius: 2, marginBottom: 8 },
  progressFill:  { height: 3, backgroundColor: '#49C593', borderRadius: 2 },
  dateRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateRight:     { flexDirection: 'row', alignItems: 'center', gap: 4 },
  date:          { color: '#666', fontSize: 12 },
  dropdown:      { overflow: 'hidden' },
  dropdownInner: { paddingTop: 14, borderTopWidth: 1, borderTopColor: '#2A2A2A', marginTop: 12 },
  detailGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  detailCell:    { width: '47%' },
  detailLabel:   { color: '#666', fontSize: 11, marginBottom: 2 },
  detailValue:   { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  trackBtn:      { borderWidth: 1, borderColor: '#49C593', borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  trackBtnText:  { color: '#49C593', fontSize: 13, fontWeight: '700' },
});
