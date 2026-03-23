import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Menu, Plus, ChevronDown } from 'lucide-react-native';
import MenuOverlay from '../components/MenuOverlay';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = SCREEN_HEIGHT * 0.38;

const BRAND_GRADIENT = ['#49C593', '#235F47'] as const;
const GRADIENT_START = { x: 0, y: 0 };
const GRADIENT_END   = { x: 1, y: 1 };

interface Props {
  navigation?: any;
}

// ─── Route data ───────────────────────────────────────────────────────────────

interface Route {
  id: string;
  fromCity: string;
  toCity: string;
  fromDate: string;
  toDate: string;
  progress: number;
}

const ROUTES: Route[] = [
  { id: '1', fromCity: 'Luanda',   toCity: 'Benguela',  fromDate: 'Jun 11', toDate: 'Jun 12', progress: 0.95 },
  { id: '2', fromCity: 'Benguela', toCity: 'Luanda',    fromDate: 'Jun 10', toDate: 'Jun 11', progress: 0.80 },
  { id: '3', fromCity: 'Angola',   toCity: 'Namibia',   fromDate: 'Jun 5',  toDate: 'Jun 13', progress: 0.55 },
  { id: '4', fromCity: 'Luanda',   toCity: 'Cabu Ledo', fromDate: 'Jun 11', toDate: 'Jun 11', progress: 0.90 },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function MapHomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Fixed navbar ─────────────────────────────────────────────────── */}
      <LinearGradient
        colors={BRAND_GRADIENT}
        start={GRADIENT_START}
        end={GRADIENT_END}
        style={[styles.navbar, { paddingTop: insets.top }]}
      >
        <TouchableOpacity
          onPress={() => setSidebarOpen(true)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Menu size={24} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>

        {/* ATRUCK logo */}
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Text style={styles.logoBoxText}>A</Text>
          </View>
          <Text style={styles.logoText}>TRUCK</Text>
        </View>

        {/* Balancing spacer */}
        <View style={{ width: 24 }} />
      </LinearGradient>

      {/* ── Scrollable content ───────────────────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Gradient map section (continues the navbar gradient) ── */}
        <LinearGradient
          colors={BRAND_GRADIENT}
          start={GRADIENT_START}
          end={GRADIENT_END}
          style={styles.mapSection}
        >
          <View style={styles.mapWrapper}>
            <MapView
              style={StyleSheet.absoluteFillObject}
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
              initialRegion={{
                latitude: -8.8368,
                longitude: 13.2343,
                latitudeDelta: 0.08,
                longitudeDelta: 0.08,
              }}
              customMapStyle={lightMapStyle}
            />

            {/* Bottom-left overlay */}
            <View style={styles.mapOverlay} pointerEvents="none">
              <Text style={styles.mapOverlayTitle}>Location Tracking</Text>
              <View style={styles.mapOverlayRow}>
                <View style={styles.statusDot} />
                <Text style={styles.mapOverlaySubtitle}>No active orders now</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* ── Create New Shipping ── */}
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => navigation?.navigate('CreateOrder')}
          activeOpacity={0.8}
        >
          <Text style={styles.createBtnText}>Create New Shipping</Text>
          <View style={styles.plusBox}>
            <Plus size={20} color="#000000" strokeWidth={2.5} />
          </View>
        </TouchableOpacity>

        {/* ── Promo banner ── */}
        <View style={styles.banner}>
          <View style={styles.bannerTab}>
            <Text style={styles.bannerTabText}>Save 15%</Text>
          </View>
          <View style={styles.bannerBody}>
            <Text style={styles.bannerTitle}>Available{'\n'}Trucks</Text>
          </View>
          <Image
            source={require('../../assets/side-truck.png')}
            style={styles.bannerTruck}
            resizeMode="contain"
          />
        </View>

        {/* ── Recent Shipping ── */}
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent Shipping</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.routeList}>
          {ROUTES.map((r) => (
            <RouteCard key={r.id} {...r} />
          ))}
        </View>
      </ScrollView>

      {/* ── Menu overlay ── */}
      <MenuOverlay
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </View>
  );
}

// ─── RouteCard ────────────────────────────────────────────────────────────────

interface RouteCardProps {
  fromCity: string;
  toCity: string;
  fromDate: string;
  toDate: string;
  progress: number;
}

function RouteCard({ fromCity, toCity, fromDate, toDate, progress }: RouteCardProps) {
  return (
    <View style={cardStyles.card}>
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
          <ChevronDown size={14} color="#666" />
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root:  { flex: 1, backgroundColor: '#121212' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },

  // Fixed navbar
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  logoRow:     { flexDirection: 'row', alignItems: 'center', gap: 2 },
  logoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  logoBoxText: { color: '#49C593', fontWeight: '900', fontSize: 15 },
  logoText:    { color: '#FFFFFF', fontWeight: '900', fontSize: 15, letterSpacing: 2 },

  // Map section (scrollable, continues gradient from navbar)
  mapSection: {
    height: HEADER_HEIGHT,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  mapWrapper: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  mapOverlay: { position: 'absolute', bottom: 14, left: 14 },
  mapOverlayTitle: {
    color: '#FFFFFF', fontSize: 15, fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  mapOverlayRow:     { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  statusDot:         { width: 7, height: 7, borderRadius: 4, backgroundColor: '#FFD700' },
  mapOverlaySubtitle: {
    color: '#FFFFFF', fontSize: 12,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // Create New Shipping
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  createBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  plusBox: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
  },

  // Promo banner
  banner: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 14,
    overflow: 'hidden',
    height: 110,
    alignItems: 'center',
  },
  bannerTab: {
    width: 44,
    backgroundColor: '#49C593',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTabText: {
    color: '#FFFFFF', fontWeight: '800', fontSize: 13,
    transform: [{ rotate: '-90deg' }],
    width: 70, textAlign: 'center',
  },
  bannerBody: { flex: 1, paddingLeft: 16, justifyContent: 'center' },
  bannerTitle: { color: '#49C593', fontSize: 22, fontWeight: '800', lineHeight: 28 },
  bannerTruck: {
    position: 'absolute', right: -10, bottom: 0,
    width: 200, height: 100,
  },

  // Recent shipping
  recentHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, marginTop: 24, marginBottom: 12,
  },
  recentTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  viewAll:     { color: '#49C593', fontSize: 14, fontWeight: '600' },
  routeList:   { paddingHorizontal: 16, gap: 2 },

});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14, marginBottom: 8,
  },
  cityRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  city:    { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  progressTrack: { height: 3, backgroundColor: '#2E2E2E', borderRadius: 2, marginBottom: 8 },
  progressFill:  { height: 3, backgroundColor: '#49C593', borderRadius: 2 },
  dateRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateRight:{ flexDirection: 'row', alignItems: 'center', gap: 4 },
  date:     { color: '#666', fontSize: 12 },
});

// ─── Light map style ──────────────────────────────────────────────────────────
const lightMapStyle = [
  { elementType: 'geometry',           stylers: [{ color: '#e8e8e8' }] },
  { elementType: 'labels.text.fill',   stylers: [{ color: '#555' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9d6e0' }] },
  { featureType: 'poi', stylers: [{ visibility: 'simplified' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];
