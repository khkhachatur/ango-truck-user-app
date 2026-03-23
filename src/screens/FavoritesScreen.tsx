import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ArrowRight } from 'lucide-react-native';

interface Props { navigation?: any; }

interface FavRoute {
  id: string;
  fromCity: string;
  toCity: string;
  truckSize: string;
  price: string;
}

const FAVORITES: FavRoute[] = [
  { id: '1', fromCity: 'Luanda',   toCity: 'Benguela',  truckSize: 'L - Rigid Truck',  price: 'Kz 9.750 mil' },
  { id: '2', fromCity: 'Benguela', toCity: 'Luanda',    truckSize: 'M - Box Truck',    price: 'Kz 5.250 mil' },
  { id: '3', fromCity: 'Luanda',   toCity: 'Huambo',    truckSize: 'L - Rigid Truck',  price: 'Kz 11.700 mil' },
  { id: '4', fromCity: 'Malanje',  toCity: 'Luanda',    truckSize: 'M - Box Truck',    price: 'Kz 6.300 mil' },
  { id: '5', fromCity: 'Luanda',   toCity: 'Cabu Ledo', truckSize: 'S - Pickup',       price: 'Kz 2.250 mil' },
];

export default function FavoritesScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

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
        <Text style={styles.title}>Favorite Routes</Text>
        <View style={styles.backBtn} />
      </View>

      <FlatList
        data={FAVORITES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <FavCard {...item} />}
      />
    </View>
  );
}

// ─── FavCard ──────────────────────────────────────────────────────────────────

function FavCard({ fromCity, toCity, truckSize, price }: FavRoute) {
  return (
    <View style={card.wrap}>
      <View style={card.left}>
        <View style={card.routeRow}>
          <Text style={card.city}>{fromCity}</Text>
          <ArrowRight size={14} color="#49C593" strokeWidth={2.5} style={{ marginHorizontal: 6 }} />
          <Text style={card.city}>{toCity}</Text>
        </View>
        <Text style={card.meta} numberOfLines={1}>{truckSize}  ·  {price}</Text>
      </View>
      <TouchableOpacity style={card.bookBtn} activeOpacity={0.8}>
        <Text style={card.bookBtnText}>Book Again</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#121212' },
  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 },
  backBtn: { flexDirection: 'row', alignItems: 'center', minWidth: 70 },
  backText:{ color: '#FFFFFF', fontSize: 15, marginLeft: 2 },
  title:   { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  list:    { paddingHorizontal: 16, paddingTop: 8 },
});

const card = StyleSheet.create({
  wrap:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1E1E1E', borderRadius: 16, padding: 16, marginBottom: 10 },
  left:       { flex: 1, marginRight: 12 },
  routeRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  city:       { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  meta:       { color: '#888', fontSize: 12 },
  bookBtn:    { backgroundColor: '#49C593', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  bookBtnText:{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});
