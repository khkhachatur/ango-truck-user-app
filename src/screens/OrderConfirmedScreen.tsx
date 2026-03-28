import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Load } from '../lib/supabase';
import { formatKwanza } from '../utils/currency';

interface Props {
  navigation?: any;
  route?: { params?: { load: Load } };
}

export default function OrderConfirmedScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const load = route?.params?.load;

  const ref = load ? `#${load.id.slice(0, 8).toUpperCase()}` : '—';
  const price = load ? formatKwanza(load.offered_price_aoa ?? 0) : '—';

  return (
    <View style={[styles.root, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={styles.content}>
        {/* Icon */}
        <Ionicons name="checkmark-circle" size={80} color="#49C593" />

        {/* Title */}
        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>Your shipment is now open and awaiting a driver.</Text>

        {/* Reference */}
        <View style={styles.refBadge}>
          <Text style={styles.refText}>{ref}</Text>
        </View>

        {/* Route card */}
        <View style={styles.card}>
          <View style={styles.routeRow}>
            <View style={styles.routePoint}>
              <View style={[styles.dot, { backgroundColor: '#49C593' }]} />
              <Text style={styles.routeLabel} numberOfLines={2}>{load?.pickup_location ?? '—'}</Text>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routePoint}>
              <View style={[styles.dot, { backgroundColor: '#EF5350' }]} />
              <Text style={styles.routeLabel} numberOfLines={2}>{load?.dropoff_location ?? '—'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Estimated Price</Text>
            <Text style={styles.priceValue}>{price}</Text>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => load && navigation?.navigate('Tracking', { load })}
        >
          <Text style={styles.primaryBtnText}>Track Shipment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          activeOpacity={0.75}
          onPress={() => navigation?.navigate('MapHome')}
        >
          <Text style={styles.secondaryBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#121212', paddingHorizontal: 24 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },

  title:    { color: '#FFFFFF', fontSize: 28, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: '#888', fontSize: 14, textAlign: 'center', lineHeight: 20 },

  refBadge: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#49C593',
  },
  refText: { color: '#49C593', fontSize: 16, fontWeight: '800', letterSpacing: 2 },

  card: {
    width: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
  },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  routePoint: { flex: 1, alignItems: 'center', gap: 6 },
  dot:  { width: 10, height: 10, borderRadius: 5 },
  routeLabel: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  routeLine: { width: 40, height: 1, backgroundColor: '#333' },

  divider:   { height: 1, backgroundColor: '#2A2A2A', marginVertical: 16 },
  priceRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel:{ color: '#888', fontSize: 14 },
  priceValue:{ color: '#49C593', fontSize: 18, fontWeight: '800' },

  buttons: { gap: 12 },
  primaryBtn: {
    backgroundColor: '#49C593',
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  secondaryBtn: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryBtnText: { color: '#AAAAAA', fontSize: 16, fontWeight: '600' },
});
