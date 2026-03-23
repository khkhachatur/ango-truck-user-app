import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Truck } from 'lucide-react-native';
import { TruckSize, TruckConfig } from '../../constants/trucks';

interface TruckCardProps {
  size: TruckSize;
  config: TruckConfig;
  selected: boolean;
  onSelect: (size: TruckSize) => void;
}

export default function TruckCard({ size, config, selected, onSelect }: TruckCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={() => onSelect(size)}
      activeOpacity={0.8}
    >
      <Truck
        size={20}
        color={selected ? '#121212' : '#49C593'}
        strokeWidth={1.8}
      />
      <Text style={[styles.sizeLabel, selected && styles.textSelected]}>{size}</Text>
      <Text style={[styles.weightLabel, selected && styles.weightSelected]}>
        {config.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#2A2A2A',
    gap: 4,
  },
  cardSelected: {
    backgroundColor: '#49C593',
    borderColor: '#49C593',
  },
  sizeLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  textSelected: {
    color: '#121212',
  },
  weightLabel: {
    color: '#888',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  weightSelected: {
    color: '#0A2A1A',
  },
});
