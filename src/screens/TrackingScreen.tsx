import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, MessageCircle, Truck } from 'lucide-react-native';
import { supabase, Load } from '../lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DriverLocation {
  driver_id: string;
  latitude: number;
  longitude: number;
  heading: number | null;
  speed_kmh: number | null;
}

interface Props {
  navigation?: any;
  route?: { params?: { load?: Load } };
}

// ─── Status badge config ──────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  open:       { label: 'Open',       bg: '#1A3A5C', text: '#4DA3FF' },
  assigned:   { label: 'Assigned',   bg: '#3D2E00', text: '#FFB300' },
  in_transit: { label: 'In Transit', bg: '#0D3320', text: '#49C593' },
  delivered:  { label: 'Delivered',  bg: '#2A2A2A', text: '#888888' },
  cancelled:  { label: 'Cancelled',  bg: '#3D0A0A', text: '#EF5350' },
};

const LUANDA = { latitude: -8.8368, longitude: 13.2343, latitudeDelta: 0.08, longitudeDelta: 0.08 };

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function TrackingScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const load = route?.params?.load;

  const mapRef = useRef<MapView>(null);
  const bannerAnim = useRef(new Animated.Value(-80)).current;

  const [currentLoad, setCurrentLoad] = useState<Load | null>(load ?? null);
  const [driverCoord, setDriverCoord] = useState<{ latitude: number; longitude: number } | null>(null);
  const [driverName, setDriverName] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  // ── Fetch driver name ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentLoad?.assigned_driver_id) return;
    supabase
      .from('users')
      .select('full_name')
      .eq('id', currentLoad.assigned_driver_id)
      .single()
      .then(({ data }) => { if (data) setDriverName(data.full_name); });
  }, [currentLoad?.assigned_driver_id]);

  // ── Fetch initial driver location ──────────────────────────────────────────
  useEffect(() => {
    if (!currentLoad?.assigned_driver_id) return;
    supabase
      .from('driver_locations')
      .select('latitude, longitude, heading, speed_kmh')
      .eq('driver_id', currentLoad.assigned_driver_id)
      .single()
      .then(({ data }) => {
        if (data) {
          const coord = { latitude: data.latitude, longitude: data.longitude };
          setDriverCoord(coord);
          mapRef.current?.animateToRegion({ ...coord, latitudeDelta: 0.04, longitudeDelta: 0.04 }, 800);
        }
      });
  }, [currentLoad?.assigned_driver_id]);

  // ── Real-time driver location ──────────────────────────────────────────────
  useEffect(() => {
    if (!currentLoad?.assigned_driver_id) return;

    const channel = supabase
      .channel(`driver-loc:${currentLoad.assigned_driver_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'driver_locations',
          filter: `driver_id=eq.${currentLoad.assigned_driver_id}`,
        },
        (payload) => {
          const loc = payload.new as DriverLocation;
          const coord = { latitude: loc.latitude, longitude: loc.longitude };
          setDriverCoord(coord);
          mapRef.current?.animateCamera(
            { center: coord, zoom: 14 },
            { duration: 1200 },
          );
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentLoad?.assigned_driver_id]);

  // ── Real-time load status ──────────────────────────────────────────────────
  const showDeliveryBanner = useCallback(() => {
    setShowBanner(true);
    Animated.sequence([
      Animated.spring(bannerAnim, { toValue: 0, useNativeDriver: true, damping: 14, stiffness: 100 }),
      Animated.delay(4000),
      Animated.timing(bannerAnim, { toValue: -80, duration: 400, useNativeDriver: true }),
    ]).start(() => setShowBanner(false));
  }, [bannerAnim]);

  useEffect(() => {
    if (!currentLoad?.id) return;

    const channel = supabase
      .channel(`load:${currentLoad.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'loads', filter: `id=eq.${currentLoad.id}` },
        (payload) => {
          const updated = payload.new as Load;
          setCurrentLoad(updated);
          if (updated.status === 'delivered' && !showBanner) {
            showDeliveryBanner();
          }
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentLoad?.id, showDeliveryBanner]);

  // ── Early guard ────────────────────────────────────────────────────────────
  if (!currentLoad) {
    return (
      <View style={[styles.root, styles.centered]}>
        <Text style={styles.emptyText}>No shipment data.</Text>
      </View>
    );
  }

  const statusCfg = STATUS_CONFIG[currentLoad.status] ?? STATUS_CONFIG.open;
  const hasDriver = !!currentLoad.assigned_driver_id;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Map or placeholder ── */}
      {hasDriver ? (
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={LUANDA}
          showsUserLocation={false}
        >
          {driverCoord && (
            <Marker coordinate={driverCoord} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={styles.truckMarker}>
                <Truck size={16} color="#FFFFFF" strokeWidth={2.5} />
              </View>
            </Marker>
          )}
        </MapView>
      ) : (
        <View style={[StyleSheet.absoluteFillObject, styles.noDriverBg]}>
          <Text style={styles.noDriverText}>Awaiting driver assignment</Text>
        </View>
      )}

      {/* ── Delivery banner ── */}
      {showBanner && (
        <Animated.View
          style={[styles.banner, { top: insets.top, transform: [{ translateY: bannerAnim }] }]}
        >
          <Text style={styles.bannerText}>Delivery Complete! 🎉</Text>
        </Animated.View>
      )}

      {/* ── Back button ── */}
      <TouchableOpacity
        style={[styles.backBtn, { top: insets.top + 12 }]}
        onPress={() => navigation?.goBack()}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2} />
      </TouchableOpacity>

      {/* ── Bottom sheet card ── */}
      <View style={[styles.card, { paddingBottom: insets.bottom + 16 }]}>
        {/* Status badge */}
        <View style={[styles.badge, { backgroundColor: statusCfg.bg }]}>
          <Text style={[styles.badgeText, { color: statusCfg.text }]}>{statusCfg.label}</Text>
        </View>

        {/* Route */}
        <Text style={styles.route} numberOfLines={1}>
          {currentLoad.pickup_location}  →  {currentLoad.dropoff_location}
        </Text>

        {/* Driver + distance row */}
        <View style={styles.metaRow}>
          <Text style={styles.meta}>
            {driverName ? `Driver: ${driverName}` : hasDriver ? 'Fetching driver…' : 'No driver yet'}
          </Text>
          {currentLoad.distance_km > 0 && (
            <Text style={styles.meta}>{currentLoad.distance_km} km</Text>
          )}
        </View>

        {/* POD — shown when delivered */}
        {currentLoad.status === 'delivered' && !!currentLoad.pod_url && (
          <View style={styles.podWrap}>
            <Text style={styles.podLabel}>Proof of Delivery</Text>
            <Image
              source={{ uri: currentLoad.pod_url }}
              style={styles.podImage}
              resizeMode="cover"
            />
          </View>
        )}
      </View>

      {/* ── Chat FAB ── */}
      {hasDriver && (
        <TouchableOpacity
          style={[styles.fab, { bottom: insets.bottom + 160 }]}
          activeOpacity={0.85}
          onPress={() =>
            navigation?.navigate('Chat', {
              load_id: currentLoad.id,
              receiver_id: currentLoad.assigned_driver_id,
            })
          }
        >
          <MessageCircle size={22} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#121212' },
  centered:{ justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#555', fontSize: 15 },

  noDriverBg: {
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDriverText: { color: '#555', fontSize: 15, textAlign: 'center', paddingHorizontal: 32 },

  truckMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#49C593',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 6,
  },

  banner: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 20,
    backgroundColor: '#49C593',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  bannerText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },

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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 12,
  },
  badgeText: { fontSize: 11, fontWeight: '700' },

  route: { color: '#FFFFFF', fontSize: 17, fontWeight: '700', marginBottom: 8 },

  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  meta:    { color: '#888', fontSize: 13 },

  podWrap:  { marginTop: 4, marginBottom: 8 },
  podLabel: { color: '#AAAAAA', fontSize: 12, fontWeight: '600', marginBottom: 8 },
  podImage: { width: '100%', height: 180, borderRadius: 12 },

  fab: {
    position: 'absolute',
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#49C593',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
});
