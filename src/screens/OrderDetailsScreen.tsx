import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MapPin, Navigation, Truck } from 'lucide-react-native';

import { TRUCK_SIZES, TruckSize } from '../../constants/trucks';
import { fromPrice } from '../utils/currency';
import GreenButton from '../components/GreenButton';
import InputField from '../components/InputField';
import TruckCard from '../components/TruckCard';

// Replace with useNavigation() typing once React Navigation is installed
interface Props {
  navigation?: any;
}

export default function OrderDetailsScreen({ navigation }: Props) {
  const [selectedSize, setSelectedSize] = useState<TruckSize>('S');

  const truck = TRUCK_SIZES[selectedSize];
  const priceLabel = fromPrice(truck.pricePerKmKz);

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title}>Order Setup</Text>
        <Text style={styles.subtitle}>Choose your truck and set route</Text>

        {/* Truck Illustration */}
        <View style={styles.truckContainer}>
          <View style={styles.truckGlow} />
          <Truck size={120} color="#49C593" strokeWidth={1} />
          <Text style={styles.truckName}>{truck.label}</Text>
          <Text style={styles.truckDesc}>{truck.description}</Text>
        </View>

        {/* Size Picker */}
        <Text style={styles.sectionLabel}>Select Size</Text>
        <View style={styles.pickerRow}>
          {(Object.keys(TRUCK_SIZES) as TruckSize[]).map((size) => (
            <TruckCard
              key={size}
              size={size}
              config={TRUCK_SIZES[size]}
              selected={selectedSize === size}
              onSelect={setSelectedSize}
            />
          ))}
        </View>

        {/* Weight badge */}
        <View style={styles.weightBadge}>
          <Text style={styles.weightText}>
            Max capacity · up to{' '}
            <Text style={styles.weightValue}>
              {truck.maxWeightKg.toLocaleString('pt-AO')}kg
            </Text>
          </Text>
        </View>

        {/* Route Inputs */}
        <Text style={styles.sectionLabel}>Route</Text>
        <View style={styles.inputGroup}>
          <InputField
            placeholder="Where from"
            value={from}
            onChangeText={setFrom}
            Icon={Navigation}
          />
          <View style={styles.routeLine} />
          <InputField
            placeholder="Where to"
            value={to}
            onChangeText={setTo}
            Icon={MapPin}
          />
        </View>

        {/* Price Section */}
        <View style={styles.priceCard}>
          <View>
            <Text style={styles.priceCaption}>Estimated price</Text>
            <Text style={styles.priceValue}>From {priceLabel}</Text>
            <Text style={styles.priceNote}>
              {truck.pricePerKmKz.toLocaleString('pt-AO')} Kz / km
            </Text>
          </View>
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>{selectedSize}</Text>
          </View>
        </View>

        {/* Order Button */}
        <GreenButton
          label="Order"
          onPress={() => {
            // navigate to confirmation or map
          }}
          style={styles.orderButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 16,
  },

  // Header
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
    marginBottom: 28,
  },

  // Truck Illustration
  truckContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  truckGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#49C593',
    opacity: 0.06,
  },
  truckName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  truckDesc: {
    color: '#888',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },

  // Section labels
  sectionLabel: {
    color: '#AAAAAA',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },

  // Picker
  pickerRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },

  // Weight badge
  weightBadge: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 28,
    borderLeftWidth: 3,
    borderLeftColor: '#49C593',
  },
  weightText: {
    color: '#888',
    fontSize: 13,
  },
  weightValue: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Inputs
  inputGroup: {
    marginBottom: 28,
    gap: 0,
  },
  routeLine: {
    width: 2,
    height: 12,
    backgroundColor: '#49C593',
    marginLeft: 22,
    opacity: 0.4,
  },

  // Price card
  priceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  priceCaption: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  priceValue: {
    color: '#49C593',
    fontSize: 22,
    fontWeight: '800',
  },
  priceNote: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  priceBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#49C59320',
    borderWidth: 1.5,
    borderColor: '#49C593',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceBadgeText: {
    color: '#49C593',
    fontSize: 16,
    fontWeight: '800',
  },

  // Button
  orderButton: {
    paddingVertical: 18,
    borderRadius: 16,
  },
});
