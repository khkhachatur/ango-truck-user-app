import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  Package,
  Navigation,
  ShoppingBag,
  CheckCircle,
  Circle,
  Minus,
  Plus,
} from 'lucide-react-native';

// ─── Brand ────────────────────────────────────────────────────────────────────

const BRAND_GRADIENT = ['#49C593', '#235F47'] as const;
const BRAND          = '#49C593';

// ─── Types & constants ────────────────────────────────────────────────────────

type Tab       = 'City-wide' | 'Intercity';
type TruckSize = 'S' | 'M' | 'L' | 'XL';
type PickupType = 'now' | 'scheduled';

const WEIGHT_MAP: Record<TruckSize, string> = {
  S:  '1.000kg',
  M:  '3.500kg',
  L:  '8.000kg',
  XL: '25.000kg',
};

const TRUCK_IMAGES: Record<TruckSize, ReturnType<typeof require>> = {
  S:  require('../../assets/truk-s.png'),
  M:  require('../../assets/truck-m.png'),
  L:  require('../../assets/truck-l.png'),
  XL: require('../../assets/truck-xl.png'),
};

const SIZES: TruckSize[] = ['S', 'M', 'L', 'XL'];

// ─── Screen ───────────────────────────────────────────────────────────────────

interface Props {
  navigation?: any;
}

type EditField = 'from' | 'to' | 'weight' | null;

export default function CreateOrderScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const [activeTab,    setActiveTab]    = useState<Tab>('City-wide');
  const [selectedSize, setSelectedSize] = useState<TruckSize>('M');
  const [loaderCount,  setLoaderCount]  = useState(0); // 0 = None, 1-8
  const [pickupType,   setPickupType]   = useState<PickupType>('now');

  // Editable fields
  const [fromValue,   setFromValue]   = useState('Luanda, Benfica');
  const [toValue,     setToValue]     = useState('Benguela');
  const [weightValue, setWeightValue] = useState('2.200 kg');
  const [editField,   setEditField]   = useState<EditField>(null);

  const fromRef   = useRef<TextInput>(null);
  const toRef     = useRef<TextInput>(null);
  const weightRef = useRef<TextInput>(null);

  const handleEdit = (field: EditField) => {
    setEditField(field);
    setTimeout(() => {
      if (field === 'from')   fromRef.current?.focus();
      if (field === 'to')     toRef.current?.focus();
      if (field === 'weight') weightRef.current?.focus();
    }, 50);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
      >
        {/* ══════════════════════════════════════════════════════════════════
            TOP — Brand gradient section
        ══════════════════════════════════════════════════════════════════ */}
        <LinearGradient
          colors={BRAND_GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.greenSection, { paddingTop: insets.top + 12 }]}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation?.goBack()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <X size={22} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>

            <View style={styles.logoRow}>
              <View style={styles.logoBox}>
                <Text style={styles.logoBoxText}>A</Text>
              </View>
              <Text style={styles.logoText}>TRUCK</Text>
            </View>

            <View style={{ width: 22 }} />
          </View>

          {/* Folder tabs */}
          <View style={styles.tabRow}>
            <TouchableOpacity style={styles.tabCityWide} onPress={() => setActiveTab('City-wide')} activeOpacity={0.8}>
              <Text style={[styles.tabText, activeTab === 'City-wide' ? styles.tabActive : styles.tabInactive]}>
                City-wide
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabIntercity, activeTab === 'Intercity' && styles.tabIntercitySelected]}
              onPress={() => setActiveTab('Intercity')}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === 'Intercity' ? styles.tabActive : styles.tabInactive]}>
                Intercity
              </Text>
            </TouchableOpacity>
          </View>

          {/* Truck image card */}
          <View style={styles.truckCard}>
            <Image
              source={TRUCK_IMAGES[selectedSize]}
              style={styles.truckImage}
              resizeMode="contain"
            />
            <Text style={styles.truckCaption}>up to {WEIGHT_MAP[selectedSize]}</Text>
          </View>

          {/* Segmented controls */}
          <View style={styles.controlsWrap}>

            {/* Size */}
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>City-wide</Text>
              <View style={styles.pill}>
                {SIZES.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.pillItem, selectedSize === s && styles.pillItemActive]}
                    onPress={() => setSelectedSize(s)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.pillText, selectedSize === s ? styles.pillTextActive : styles.pillTextInactive]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.controlDivider} />

            {/* Loaders */}
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Loaders</Text>
              <View style={styles.pill}>
                {/* None toggle */}
                <TouchableOpacity
                  style={[styles.pillItem, loaderCount === 0 && styles.pillItemActive]}
                  onPress={() => setLoaderCount(0)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.pillText, loaderCount === 0 ? styles.pillTextActive : styles.pillTextInactive]}>
                    None
                  </Text>
                </TouchableOpacity>

                {/* Stepper */}
                <View style={[styles.pillItem, styles.pillStepper, loaderCount > 0 && styles.pillItemActive]}>
                  <TouchableOpacity
                    onPress={() => setLoaderCount((c) => Math.max(1, c - 1))}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    disabled={loaderCount === 0}
                  >
                    <Minus size={12} color={loaderCount > 0 ? '#FFFFFF' : '#AAAAAA'} strokeWidth={2.5} />
                  </TouchableOpacity>

                  <Text style={[styles.pillText, loaderCount > 0 ? styles.pillTextActive : styles.pillTextInactive]}>
                    {loaderCount === 0 ? '1' : loaderCount}
                  </Text>

                  <TouchableOpacity
                    onPress={() => setLoaderCount((c) => Math.min(8, c === 0 ? 1 : c + 1))}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Plus size={12} color={loaderCount > 0 ? '#FFFFFF' : '#888'} strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

          </View>
        </LinearGradient>

        {/* ══════════════════════════════════════════════════════════════════
            BOTTOM — Dark section
        ══════════════════════════════════════════════════════════════════ */}
        <View style={styles.darkSection}>
          <Text style={styles.sectionTitle}>Price calculation</Text>

          <View style={styles.orderRows}>
            {/* Where from */}
            <View style={[rowStyles.row, rowStyles.border]}>
              <View style={rowStyles.iconWrap}>
                <Package size={18} color="#AAAAAA" strokeWidth={1.8} />
              </View>
              <View style={rowStyles.textWrap}>
                <Text style={rowStyles.label}>Where from</Text>
                {editField === 'from' ? (
                  <TextInput
                    ref={fromRef}
                    style={rowStyles.input}
                    value={fromValue}
                    onChangeText={setFromValue}
                    onBlur={() => setEditField(null)}
                    returnKeyType="done"
                    onSubmitEditing={() => setEditField(null)}
                  />
                ) : (
                  <Text style={rowStyles.value}>{fromValue}</Text>
                )}
              </View>
              <TouchableOpacity style={rowStyles.editBtn} onPress={() => handleEdit('from')}>
                <Text style={rowStyles.editText}>{editField === 'from' ? 'Done' : 'Edit'}</Text>
              </TouchableOpacity>
            </View>

            {/* Where to */}
            <View style={[rowStyles.row, rowStyles.border]}>
              <View style={rowStyles.iconWrap}>
                <Navigation size={18} color="#AAAAAA" strokeWidth={1.8} />
              </View>
              <View style={rowStyles.textWrap}>
                <Text style={rowStyles.label}>Where to</Text>
                {editField === 'to' ? (
                  <TextInput
                    ref={toRef}
                    style={rowStyles.input}
                    value={toValue}
                    onChangeText={setToValue}
                    onBlur={() => setEditField(null)}
                    returnKeyType="done"
                    onSubmitEditing={() => setEditField(null)}
                  />
                ) : (
                  <Text style={rowStyles.value}>{toValue}</Text>
                )}
              </View>
              <TouchableOpacity style={rowStyles.editBtn} onPress={() => handleEdit('to')}>
                <Text style={rowStyles.editText}>{editField === 'to' ? 'Done' : 'Edit'}</Text>
              </TouchableOpacity>
            </View>

            {/* Weight */}
            <View style={rowStyles.row}>
              <View style={rowStyles.iconWrap}>
                <ShoppingBag size={18} color="#AAAAAA" strokeWidth={1.8} />
              </View>
              <View style={rowStyles.textWrap}>
                <Text style={rowStyles.label}>Approximate weight</Text>
                {editField === 'weight' ? (
                  <TextInput
                    ref={weightRef}
                    style={rowStyles.input}
                    value={weightValue}
                    onChangeText={setWeightValue}
                    onBlur={() => setEditField(null)}
                    returnKeyType="done"
                    keyboardType="decimal-pad"
                    onSubmitEditing={() => setEditField(null)}
                  />
                ) : (
                  <Text style={rowStyles.value}>{weightValue}</Text>
                )}
              </View>
              <TouchableOpacity style={rowStyles.editBtn} onPress={() => handleEdit('weight')}>
                <Text style={rowStyles.editText}>{editField === 'weight' ? 'Done' : 'Edit'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Paid waiting time */}
          <TouchableOpacity style={styles.waitingPill} activeOpacity={0.7}>
            <Text style={styles.waitingPillText}>Paid waiting time</Text>
            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>i</Text>
            </View>
          </TouchableOpacity>

          {/* Pickup */}
          <Text style={styles.sectionTitle}>Pickup</Text>

          <PickupRow
            label="In 5-15 mins"
            active={pickupType === 'now'}
            onPress={() => setPickupType('now')}
          />
          <View style={styles.pickupDivider} />
          <PickupRow
            label="Choose the date"
            active={pickupType === 'scheduled'}
            onPress={() => setPickupType('scheduled')}
            dimmed
          />
        </View>

        {/* Order button */}
        <TouchableOpacity style={styles.orderBtn} activeOpacity={0.85}>
          <Text style={styles.orderBtnText}>Order</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ─── PickupRow ────────────────────────────────────────────────────────────────

interface PickupRowProps {
  label: string;
  active: boolean;
  onPress: () => void;
  dimmed?: boolean;
}

function PickupRow({ label, active, onPress, dimmed = false }: PickupRowProps) {
  return (
    <TouchableOpacity style={pickupStyles.row} onPress={onPress} activeOpacity={0.7}>
      <Text style={[pickupStyles.label, dimmed && !active && pickupStyles.labelDim]}>{label}</Text>
      <View style={pickupStyles.right}>
        <Text style={pickupStyles.price}>
          <Text style={pickupStyles.from}>from </Text>
          <Text style={pickupStyles.priceValue}>Kz250 mil</Text>
        </Text>
        {active ? (
          /* White check icon on green circle — clearly visible on dark bg */
          <View style={pickupStyles.checkCircle}>
            <CheckCircle size={28} color="#FFFFFF" strokeWidth={2} />
          </View>
        ) : (
          /* Outlined grey circle — clearly distinct from active */
          <View style={pickupStyles.emptyCircle} />
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root:          { flex: 1, backgroundColor: '#121212' },
  scrollContent: { flexGrow: 1 },

  greenSection: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 20,
  },
  logoRow:     { flexDirection: 'row', alignItems: 'center', gap: 2 },
  logoBox: {
    backgroundColor: '#FFFFFF', borderRadius: 6,
    paddingHorizontal: 5, paddingVertical: 2,
  },
  logoBoxText: { color: BRAND, fontWeight: '900', fontSize: 15 },
  logoText:    { color: '#FFFFFF', fontWeight: '900', fontSize: 15, letterSpacing: 2 },

  // Tabs
  tabRow:        { flexDirection: 'row', alignItems: 'flex-end' },
  tabCityWide:   { paddingHorizontal: 4, paddingVertical: 8, marginRight: 8 },
  tabIntercity: {
    backgroundColor: '#2A2A2A', borderTopLeftRadius: 12,
    borderTopRightRadius: 12, paddingHorizontal: 16, paddingVertical: 8,
  },
  tabIntercitySelected: { backgroundColor: '#1e3a2a' },
  tabText:    { fontSize: 14, fontWeight: '600' },
  tabActive:  { color: '#FFFFFF' },
  tabInactive:{ color: '#AAAAAA' },

  // Truck card
  truckCard: {
    backgroundColor: '#2A2A2A',
    borderTopLeftRadius: 0, borderTopRightRadius: 16,
    borderBottomLeftRadius: 16, borderBottomRightRadius: 16,
    height: 220, alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  truckImage:   { width: '75%', height: 160 },
  truckCaption: { position: 'absolute', bottom: 14, color: '#AAAAAA', fontSize: 13 },

  // Controls
  controlsWrap: {
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 16, paddingHorizontal: 16,
  },
  controlRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingVertical: 14,
  },
  controlDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.12)' },
  controlLabel:   { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },

  // Pill
  pill: {
    flexDirection: 'row', backgroundColor: '#FFFFFF',
    borderRadius: 50, padding: 4, gap: 2, alignItems: 'center',
  },
  pillItem:        { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 50 },
  pillItemActive:  { backgroundColor: BRAND },
  pillStepper:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pillText:         { fontSize: 14, fontWeight: '700' },
  pillTextActive:   { color: '#FFFFFF' },
  pillTextInactive: { color: '#888888' },

  // Dark section
  darkSection: {
    backgroundColor: '#1E1E1E', marginHorizontal: 16,
    marginTop: 16, borderRadius: 20,
    paddingHorizontal: 16, paddingTop: 4, paddingBottom: 8,
  },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginVertical: 16 },
  orderRows:    { marginBottom: 12 },

  // Paid waiting
  waitingPill: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    borderWidth: 1, borderColor: '#444', borderRadius: 50,
    paddingHorizontal: 14, paddingVertical: 8, gap: 8, marginBottom: 8,
  },
  waitingPillText: { color: '#888', fontSize: 13 },
  infoBadge: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 1, borderColor: '#666', alignItems: 'center', justifyContent: 'center',
  },
  infoBadgeText: { color: '#666', fontSize: 11, fontWeight: '700' },

  pickupDivider: { height: 1, backgroundColor: '#2A2A2A', marginVertical: 2 },

  // Order button
  orderBtn: {
    backgroundColor: '#E0E0E0', borderRadius: 16,
    paddingVertical: 18, alignItems: 'center',
    marginHorizontal: 16, marginTop: 16,
  },
  orderBtnText: { color: '#333333', fontSize: 16, fontWeight: 'bold' },
});

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
  border: { borderBottomWidth: 1, borderBottomColor: '#2A2A2A' },
  iconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#2A2A2A', alignItems: 'center', justifyContent: 'center',
  },
  textWrap: { flex: 1 },
  label:    { color: '#888', fontSize: 12, marginBottom: 2 },
  value:    { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  input: {
    color: '#FFFFFF', fontSize: 15, fontWeight: '600',
    padding: 0, borderBottomWidth: 1, borderBottomColor: BRAND,
  },
  editBtn: {
    borderWidth: 1, borderColor: '#444', borderRadius: 50,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  editText: { color: '#FFFFFF', fontSize: 13 },
});

const pickupStyles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingVertical: 14,
  },
  right:      { flexDirection: 'row', alignItems: 'center', gap: 12 },
  label:      { color: '#FFFFFF', fontSize: 15 },
  labelDim:   { color: '#888' },
  price:      { fontSize: 14 },
  from:       { color: '#888' },
  priceValue: { color: '#FFFFFF', fontWeight: '700' },

  // Active: green filled circle with white icon inside
  checkCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: BRAND,
    alignItems: 'center', justifyContent: 'center',
  },
  // Inactive: outlined grey circle
  emptyCircle: {
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 2, borderColor: '#555',
  },
});
