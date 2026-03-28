import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { supabase, Load } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { formatKwanza } from '../utils/currency';

interface Props {
  navigation?: any;
}

// ─── Status badge config ──────────────────────────────────────────────────────

const STATUS_CONFIG: Record<Load['status'], { label: string; bg: string; text: string }> = {
  open:       { label: 'Open',       bg: '#1A3A5C', text: '#4DA3FF' },
  assigned:   { label: 'Assigned',   bg: '#3D2E00', text: '#FFB300' },
  in_transit: { label: 'In Transit', bg: '#0D3320', text: '#49C593' },
  delivered:  { label: 'Delivered',  bg: '#2A2A2A', text: '#888888' },
  cancelled:  { label: 'Cancelled',  bg: '#3D0A0A', text: '#EF5350' },
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ShippingHistoryScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [loads, setLoads] = useState<Load[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchLoads = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('loads')
      .select('*')
      .eq('shipper_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setLoads(data as Load[]);
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchLoads();
  }, [fetchLoads]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('loads:shipper')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'loads',
          filter: `shipper_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLoads((prev) => [payload.new as Load, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setLoads((prev) =>
              prev.map((l) => (l.id === (payload.new as Load).id ? (payload.new as Load) : l)),
            );
          } else if (payload.eventType === 'DELETE' && payload.old?.id) {
            setLoads((prev) => prev.filter((l) => l.id !== payload.old.id));
          }
        },
      )
      .subscribe();

    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchLoads();
    setRefreshing(false);
  }, [fetchLoads]);

  async function cancelLoad(load: Load) {
    Alert.alert(
      'Cancel Shipment',
      'Are you sure you want to cancel this shipment?',
      [
        { text: 'Keep', style: 'cancel' },
        {
          text: 'Cancel Shipment',
          style: 'destructive',
          onPress: async () => {
            await supabase
              .from('loads')
              .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
              .eq('id', load.id);
          },
        },
      ],
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Shipments</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#49C593"
          />
        }
      >
        {loads.length === 0 && (
          <Text style={styles.emptyText}>No shipments yet.</Text>
        )}
        {loads.map((load) => (
          <ShipmentCard
            key={load.id}
            load={load}
            onPress={() => navigation?.navigate('Tracking', { load })}
            onCancel={() => cancelLoad(load)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// ─── ShipmentCard ─────────────────────────────────────────────────────────────

function ShipmentCard({
  load,
  onPress,
  onCancel,
}: {
  load: Load;
  onPress: () => void;
  onCancel: () => void;
}) {
  const cfg = STATUS_CONFIG[load.status] ?? STATUS_CONFIG.open;
  const createdDate = new Date(load.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const price = load.offered_price_aoa ?? load.estimated_price_aoa ?? 0;

  return (
    <TouchableOpacity style={card.wrap} activeOpacity={0.75} onPress={onPress}>
      {/* Route row */}
      <View style={card.routeRow}>
        <Text style={card.city} numberOfLines={1}>{load.pickup_location}</Text>
        <Text style={card.arrow}>→</Text>
        <Text style={card.city} numberOfLines={1}>{load.dropoff_location}</Text>
      </View>

      {/* Status badge */}
      <View style={[card.badge, { backgroundColor: cfg.bg }]}>
        <Text style={[card.badgeText, { color: cfg.text }]}>{cfg.label}</Text>
      </View>

      {/* Details */}
      <Text style={card.cargo} numberOfLines={2}>{load.cargo_description}</Text>

      <View style={card.footer}>
        <Text style={card.price}>{formatKwanza(price)}</Text>
        <Text style={card.date}>{createdDate}</Text>
      </View>

      {/* Cancel button — only for open loads */}
      {load.status === 'open' && (
        <TouchableOpacity
          style={card.cancelBtn}
          activeOpacity={0.7}
          onPress={(e) => { e.stopPropagation(); onCancel(); }}
        >
          <Text style={card.cancelText}>Cancel Shipment</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root:  { flex: 1, backgroundColor: '#121212' },
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
  emptyText:   { color: '#555', textAlign: 'center', marginTop: 60, fontSize: 15 },
});

const card = StyleSheet.create({
  wrap: {
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  city:  { color: '#FFFFFF', fontSize: 15, fontWeight: '700', flex: 1 },
  arrow: { color: '#49C593', fontSize: 14, fontWeight: '700' },

  badge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 10,
  },
  badgeText: { fontSize: 11, fontWeight: '700' },

  cargo: { color: '#AAAAAA', fontSize: 13, marginBottom: 12, lineHeight: 18 },

  footer:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price:   { color: '#49C593', fontSize: 14, fontWeight: '700' },
  date:    { color: '#555', fontSize: 12 },

  cancelBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#EF5350',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelText: { color: '#EF5350', fontSize: 13, fontWeight: '600' },
});
