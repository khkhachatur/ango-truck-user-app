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
import { ChevronLeft, Smartphone, FileText, CreditCard, ChevronRight, Plus, LucideIcon } from 'lucide-react-native';

interface Props { navigation?: any; }

interface PaymentMethod {
  id: string;
  icon: LucideIcon;
  label: string;
  detail: string;
}

const METHODS: PaymentMethod[] = [
  { id: '1', icon: Smartphone,  label: 'Multicaixa Express',   detail: 'Mobile payment' },
  { id: '2', icon: FileText,    label: 'Corporate Invoice',    detail: 'Net 30 terms' },
  { id: '3', icon: CreditCard,  label: 'Visa •••• 4242',       detail: 'Expires 08/27' },
];

export default function PaymentMethodsScreen({ navigation }: Props) {
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
        <Text style={styles.title}>Payment Methods</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
      >
        <View style={styles.group}>
          {METHODS.map((m, i) => {
            const Icon = m.icon;
            const isLast = i === METHODS.length - 1;
            return (
              <TouchableOpacity
                key={m.id}
                style={[styles.row, !isLast && styles.rowBorder]}
                activeOpacity={0.7}
              >
                <View style={styles.iconWrap}>
                  <Icon size={20} color="#49C593" strokeWidth={1.8} />
                </View>
                <View style={styles.rowMiddle}>
                  <Text style={styles.rowLabel}>{m.label}</Text>
                  <Text style={styles.rowDetail}>{m.detail}</Text>
                </View>
                <ChevronRight size={16} color="#555" />
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}>
          <Plus size={18} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.addBtnText}>Add Payment Method</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:      { flex: 1, backgroundColor: '#121212' },
  header:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 },
  backBtn:   { flexDirection: 'row', alignItems: 'center', minWidth: 70 },
  backText:  { color: '#FFFFFF', fontSize: 15, marginLeft: 2 },
  title:     { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  content:   { paddingHorizontal: 16, paddingTop: 8 },
  group:     { backgroundColor: '#1E1E1E', borderRadius: 16, marginBottom: 24, overflow: 'hidden' },
  row:       { flexDirection: 'row', alignItems: 'center', padding: 16 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#333' },
  iconWrap:  { width: 40, height: 40, borderRadius: 12, backgroundColor: '#2A2A2A', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  rowMiddle: { flex: 1 },
  rowLabel:  { color: '#FFFFFF', fontSize: 15, fontWeight: '600', marginBottom: 2 },
  rowDetail: { color: '#888', fontSize: 12 },
  addBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#49C593', borderRadius: 16, padding: 16 },
  addBtnText:{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
