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
import { ChevronLeft, MapPin, MoreVertical } from 'lucide-react-native';

interface Props { navigation?: any; }

interface Address {
  id: string;
  label: string;
  detail: string;
}

const ADDRESSES: Address[] = [
  { id: '1', label: 'Main Warehouse',   detail: 'Talatona, Via AL15, Luanda' },
  { id: '2', label: 'City Office',      detail: 'Ingombota, Rua da Missão, Luanda' },
  { id: '3', label: 'Benguela Depot',   detail: 'Lobito Corridor, Benguela' },
  { id: '4', label: 'Client Delivery',  detail: 'Kilamba Kiaxi, Luanda' },
];

export default function AddressesScreen({ navigation }: Props) {
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
        <Text style={styles.title}>Addresses</Text>
        <View style={styles.backBtn} />
      </View>

      <FlatList
        data={ADDRESSES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <AddressCard {...item} />}
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 24 }]}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── AddressCard ──────────────────────────────────────────────────────────────

function AddressCard({ label, detail }: Address) {
  return (
    <View style={card.wrap}>
      <View style={card.iconWrap}>
        <MapPin size={20} color="#49C593" strokeWidth={2} />
      </View>
      <View style={card.middle}>
        <Text style={card.label}>{label}</Text>
        <Text style={card.detail} numberOfLines={1}>{detail}</Text>
      </View>
      <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <MoreVertical size={20} color="#555" />
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
  fab: {
    position: 'absolute',
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#49C593',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#49C593',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: { color: '#FFFFFF', fontSize: 28, lineHeight: 32, fontWeight: '300' },
});

const card = StyleSheet.create({
  wrap:    { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E1E', borderRadius: 16, padding: 16, marginBottom: 10 },
  iconWrap:{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#2A2A2A', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  middle:  { flex: 1, marginRight: 8 },
  label:   { color: '#FFFFFF', fontSize: 15, fontWeight: '600', marginBottom: 3 },
  detail:  { color: '#888', fontSize: 13 },
});
