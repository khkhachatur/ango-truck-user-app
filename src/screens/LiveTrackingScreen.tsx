import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { Load } from '../lib/supabase';
import { formatKwanza } from '../utils/currency';

interface Props {
  navigation?: any;
  route?: { params?: { load?: Load } };
}

export default function LiveTrackingScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const load = route?.params?.load;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Full-screen map */}
      <MapView
        style={StyleSheet.absoluteFillObject}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={{
          latitude: -8.8368,
          longitude: 13.2343,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      />

      {/* Back button */}
      <TouchableOpacity
        style={[styles.backBtn, { top: insets.top + 12 }]}
        onPress={() => navigation?.goBack()}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2} />
      </TouchableOpacity>

      {/* Bottom info card */}
      <View style={[styles.card, { paddingBottom: insets.bottom + 16 }]}>
        {load ? (
          <>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {load.pickup_location} → {load.dropoff_location}
            </Text>
            <Text style={styles.cardSub} numberOfLines={2}>{load.cargo_description}</Text>
            <View style={styles.cardRow}>
              <Text style={styles.cardPrice}>{formatKwanza(load.offered_price_aoa ?? 0)}</Text>
              <Text style={styles.cardStatus}>{load.status.replace('_', ' ').toUpperCase()}</Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.cardTitle}>Live Tracking</Text>
            <Text style={styles.cardSub}>No active order to track right now.</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#121212' },

  backBtn: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(20,20,20,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  cardTitle:  { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  cardSub:    { color: '#888', fontSize: 14, marginBottom: 12 },
  cardRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardPrice:  { color: '#49C593', fontSize: 15, fontWeight: '700' },
  cardStatus: { color: '#888', fontSize: 12, fontWeight: '600' },
});
