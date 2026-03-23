import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, ScrollText, ShieldCheck, Info, LucideIcon } from 'lucide-react-native';

interface Props { navigation?: any; }

export default function InformationScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ChevronLeft size={22} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Information</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
      >
        <View style={styles.group}>
          <InfoRow icon={ScrollText}   label="Terms of Service" />
          <InfoRow icon={ShieldCheck}  label="Privacy Policy"   />
          <InfoRow icon={Info}         label="About Ango Truck" isLast />
        </View>

        <Text style={styles.version}>App Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

// ─── InfoRow ──────────────────────────────────────────────────────────────────

interface InfoRowProps {
  icon: LucideIcon;
  label: string;
  isLast?: boolean;
}

function InfoRow({ icon: Icon, label, isLast = false }: InfoRowProps) {
  return (
    <TouchableOpacity style={[rowStyles.row, !isLast && rowStyles.border]} activeOpacity={0.7}>
      <View style={rowStyles.left}>
        <View style={rowStyles.iconWrap}>
          <Icon size={18} color="#FFFFFF" strokeWidth={1.8} />
        </View>
        <Text style={rowStyles.label}>{label}</Text>
      </View>
      <ChevronRight size={16} color="#555" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#121212' },
  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 },
  backBtn: { flexDirection: 'row', alignItems: 'center', minWidth: 70 },
  backText:{ color: '#FFFFFF', fontSize: 15, marginLeft: 2 },
  title:   { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 16, paddingTop: 8 },
  group:   { backgroundColor: '#1E1E1E', borderRadius: 16, marginBottom: 32, overflow: 'hidden' },
  version: { color: '#555', fontSize: 13, textAlign: 'center' },
});

const rowStyles = StyleSheet.create({
  row:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  border:  { borderBottomWidth: 1, borderBottomColor: '#333' },
  left:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap:{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#2A2A2A', alignItems: 'center', justifyContent: 'center' },
  label:   { color: '#FFFFFF', fontSize: 15 },
});
