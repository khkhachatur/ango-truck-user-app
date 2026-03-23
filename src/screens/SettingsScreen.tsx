import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  StatusBar,
  TextStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface Props {
  navigation?: any;
}

export default function SettingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation?.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={22} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Settings</Text>

        {/* Spacer to balance back button */}
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
      >
        {/* ── Preferences ── */}
        <Text style={styles.groupLabel}>Preferences</Text>
        <SettingsGroup>
          <SettingsRow label="Language" right={
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>English</Text>
              <ChevronRight size={16} color="#555" />
            </View>
          } />
          <SettingsRow label="Push Notifications" right={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#333', true: '#49C593' }}
              thumbColor="#FFFFFF"
            />
          } />
          <SettingsRow label="Dark Mode" isLast right={
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#333', true: '#49C593' }}
              thumbColor="#FFFFFF"
            />
          } />
        </SettingsGroup>

        {/* ── Security ── */}
        <Text style={styles.groupLabel}>Security</Text>
        <SettingsGroup>
          <SettingsRow label="Change Password" right={
            <ChevronRight size={16} color="#555" />
          } />
          <SettingsRow label="Delete Account" labelStyle={styles.dangerLabel} isLast right={
            <ChevronRight size={16} color="#555" />
          } />
        </SettingsGroup>

        {/* ── Log Out ── */}
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.7}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ─── SettingsGroup ────────────────────────────────────────────────────────────

function SettingsGroup({ children }: { children: React.ReactNode }) {
  return <View style={groupStyles.container}>{children}</View>;
}

// ─── SettingsRow ──────────────────────────────────────────────────────────────

interface SettingsRowProps {
  label: string;
  labelStyle?: TextStyle;
  right: React.ReactNode;
  isLast?: boolean;
}

function SettingsRow({ label, labelStyle, right, isLast = false }: SettingsRowProps) {
  return (
    <View style={[rowStyles.row, !isLast && rowStyles.border]}>
      <Text style={[rowStyles.label, labelStyle]}>{label}</Text>
      {right}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#121212' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 70,
  },
  backText: { color: '#FFFFFF', fontSize: 15, marginLeft: 2 },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },

  scrollContent: { paddingTop: 8 },

  groupLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowValue: { color: '#666', fontSize: 14 },

  dangerLabel: { color: '#FF4444' },

  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FF4444',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  logoutText: { color: '#FF4444', fontSize: 16, fontWeight: '700' },
});

const groupStyles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
});

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  label: { color: '#FFFFFF', fontSize: 15 },
});
