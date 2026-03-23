import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  KeyboardTypeOptions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';

interface Props { navigation?: any; }

export default function MyCompanyScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({
    companyName: '',
    nif: '',
    contactPerson: '',
    email: '',
    phone: '',
  });

  const set = (key: keyof typeof form) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ChevronLeft size={22} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Company</Text>
        <View style={styles.backBtn} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
      >
        <InputGroup>
          <InputField label="Company Name"   value={form.companyName}    onChangeText={set('companyName')}    placeholder="e.g. Ango Logistics Lda" />
          <InputField label="NIF (Tax ID)"   value={form.nif}            onChangeText={set('nif')}            placeholder="e.g. 5000123456" />
          <InputField label="Contact Person" value={form.contactPerson}  onChangeText={set('contactPerson')}  placeholder="e.g. Khachatur Silva" />
          <InputField label="Email"          value={form.email}          onChangeText={set('email')}          placeholder="e.g. contact@company.ao" keyboardType="email-address" />
          <InputField label="Phone Number"   value={form.phone}          onChangeText={set('phone')}          placeholder="e.g. +244 923 000 000"   keyboardType="phone-pad" isLast />
        </InputGroup>

        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── InputGroup ───────────────────────────────────────────────────────────────

function InputGroup({ children }: { children: React.ReactNode }) {
  return <View style={groupStyle.wrap}>{children}</View>;
}

// ─── InputField ───────────────────────────────────────────────────────────────

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  isLast?: boolean;
}

function InputField({ label, value, onChangeText, placeholder, keyboardType = 'default', isLast = false }: InputFieldProps) {
  return (
    <View style={[fieldStyle.wrap, !isLast && fieldStyle.border]}>
      <Text style={fieldStyle.label}>{label}</Text>
      <TextInput
        style={fieldStyle.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#555"
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#121212' },
  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 },
  backBtn: { flexDirection: 'row', alignItems: 'center', minWidth: 70 },
  backText:{ color: '#FFFFFF', fontSize: 15, marginLeft: 2 },
  title:   { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 16, paddingTop: 8 },
  saveBtn: { backgroundColor: '#49C593', borderRadius: 16, padding: 16, alignItems: 'center', marginTop: 8 },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});

const groupStyle = StyleSheet.create({
  wrap: { backgroundColor: '#1E1E1E', borderRadius: 16, padding: 16, marginBottom: 16 },
});

const fieldStyle = StyleSheet.create({
  wrap:   { paddingVertical: 12 },
  border: { borderBottomWidth: 1, borderBottomColor: '#2A2A2A' },
  label:  { color: '#888', fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 },
  input:  { color: '#FFFFFF', fontSize: 15 },
});
