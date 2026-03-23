import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, Truck } from 'lucide-react-native';

interface Props {
  navigation?: any;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

interface Deal {
  id: string;
  fromCity: string;
  toCity: string;
  discount: string;
  departs: string;
  truckLabel: string;
  capacity: string;
  originalPrice: string;
  discountedPrice: string;
}

const DEALS: Deal[] = [
  {
    id: '1',
    fromCity: 'Benguela', toCity: 'Luanda',
    discount: '-15%',
    departs: 'Today, 14:00 – 16:00',
    truckLabel: 'Medium Box Truck',
    capacity: '3,500 kg',
    originalPrice: 'Kz 250,000',
    discountedPrice: 'Kz 212,500',
  },
  {
    id: '2',
    fromCity: 'Namibe', toCity: 'Luanda',
    discount: '-20%',
    departs: 'Today, 17:00 – 19:00',
    truckLabel: 'Rigid Truck',
    capacity: '8,000 kg',
    originalPrice: 'Kz 420,000',
    discountedPrice: 'Kz 336,000',
  },
  {
    id: '3',
    fromCity: 'Huambo', toCity: 'Benguela',
    discount: '-10%',
    departs: 'Tomorrow, 08:00 – 10:00',
    truckLabel: 'Pickup Truck',
    capacity: '1,000 kg',
    originalPrice: 'Kz 95,000',
    discountedPrice: 'Kz 85,500',
  },
  {
    id: '4',
    fromCity: 'Malanje', toCity: 'Luanda',
    discount: '-25%',
    departs: 'Tomorrow, 06:00 – 09:00',
    truckLabel: 'Semi-Trailer',
    capacity: '25,000 kg',
    originalPrice: 'Kz 1,200,000',
    discountedPrice: 'Kz 900,000',
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function DiscountedRoutesScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Discounted Return Routes</Text>

        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={DEALS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          /* ── Filter card ── */
          <View style={styles.filterCard}>
            <View style={styles.filterRow}>
              <View style={styles.filterInputWrap}>
                <Text style={styles.filterLabel}>From City</Text>
                <TextInput
                  style={styles.filterInput}
                  placeholder="e.g. Benguela"
                  placeholderTextColor="#555"
                  value={fromCity}
                  onChangeText={setFromCity}
                />
              </View>
              <View style={styles.filterDivider} />
              <View style={styles.filterInputWrap}>
                <Text style={styles.filterLabel}>To City</Text>
                <TextInput
                  style={styles.filterInput}
                  placeholder="e.g. Luanda"
                  placeholderTextColor="#555"
                  value={toCity}
                  onChangeText={setToCity}
                />
              </View>
            </View>
            <TouchableOpacity style={styles.findBtn} activeOpacity={0.8}>
              <Text style={styles.findBtnText}>Find Trucks</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => <DealCard {...item} />}
      />
    </KeyboardAvoidingView>
  );
}

// ─── DealCard ─────────────────────────────────────────────────────────────────

function DealCard({
  fromCity, toCity, discount, departs, truckLabel, capacity, originalPrice, discountedPrice,
}: Deal) {
  return (
    <View style={card.wrap}>
      {/* Top row */}
      <View style={card.topRow}>
        <Text style={card.route}>{fromCity}  →  {toCity}</Text>
        <View style={card.discountPill}>
          <Text style={card.discountText}>{discount}</Text>
        </View>
      </View>

      {/* Middle rows */}
      <View style={card.infoRow}>
        <Clock size={14} color="#FFC107" strokeWidth={2} />
        <Text style={card.infoTextYellow}>Departs: {departs}</Text>
      </View>
      <View style={card.infoRow}>
        <Truck size={14} color="#888" strokeWidth={2} />
        <Text style={card.infoTextGrey}>{truckLabel}  (Available: {capacity})</Text>
      </View>

      {/* Divider */}
      <View style={card.divider} />

      {/* Bottom row */}
      <View style={card.bottomRow}>
        <View>
          <Text style={card.originalPrice}>{originalPrice}</Text>
          <Text style={card.discountedPrice}>{discountedPrice}</Text>
        </View>
        <TouchableOpacity style={card.claimBtn} activeOpacity={0.8}>
          <Text style={card.claimBtnText}>Claim Truck</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#121212' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },

  listContent: { paddingHorizontal: 16, paddingTop: 4 },

  // Filter card
  filterCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  filterInputWrap: { flex: 1 },
  filterLabel: { color: '#888', fontSize: 11, marginBottom: 6 },
  filterInput: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 0,
  },
  filterDivider: {
    width: 1,
    backgroundColor: '#333',
    alignSelf: 'stretch',
    marginHorizontal: 16,
    marginTop: 18,
  },
  findBtn: {
    backgroundColor: '#49C593',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  findBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});

const card = StyleSheet.create({
  wrap: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  route: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  discountPill: {
    backgroundColor: 'rgba(73, 197, 147, 0.15)',
    borderWidth: 1,
    borderColor: '#49C593',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  discountText: { color: '#49C593', fontSize: 12, fontWeight: '700' },

  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  infoTextYellow: { color: '#FFC107', fontSize: 13 },
  infoTextGrey:   { color: '#888',    fontSize: 13 },

  divider: { height: 1, backgroundColor: '#2A2A2A', marginVertical: 14 },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  originalPrice: {
    color: '#666',
    fontSize: 12,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  discountedPrice: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },

  claimBtn: {
    backgroundColor: '#49C593',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  claimBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
