import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Pencil, Check } from 'lucide-react-native';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface Props {
  navigation?: any;
}

interface Stats {
  total: number;
  active: number;
  completed: number;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SettingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode]           = useState(true);

  // Profile edit state
  const [editing, setEditing]         = useState(false);
  const [fullName, setFullName]       = useState(user?.full_name ?? '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number ?? '');
  const [saving, setSaving]           = useState(false);

  // Stats
  const [stats, setStats]       = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Keep fields in sync if user object updates
  useEffect(() => {
    if (!editing) {
      setFullName(user?.full_name ?? '');
      setPhoneNumber(user?.phone_number ?? '');
    }
  }, [user, editing]);

  // Fetch load stats
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { count: total } = await supabase
        .from('loads')
        .select('*', { count: 'exact', head: true })
        .eq('shipper_id', user.id);

      const { count: active } = await supabase
        .from('loads')
        .select('*', { count: 'exact', head: true })
        .eq('shipper_id', user.id)
        .in('status', ['assigned', 'in_transit']);

      const { count: completed } = await supabase
        .from('loads')
        .select('*', { count: 'exact', head: true })
        .eq('shipper_id', user.id)
        .eq('status', 'delivered');

      setStats({ total: total ?? 0, active: active ?? 0, completed: completed ?? 0 });
      setStatsLoading(false);
    })();
  }, [user]);

  async function saveProfile() {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('users')
      .update({ full_name: fullName, phone_number: phoneNumber })
      .eq('id', user.id);
    setSaving(false);

    if (error) {
      Alert.alert('Error', 'Could not save changes. Please try again.');
    } else {
      setEditing(false);
    }
  }

  async function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation?.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={22} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile & Settings</Text>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={editing ? saveProfile : () => setEditing(true)}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#49C593" />
          ) : editing ? (
            <Check size={20} color="#49C593" strokeWidth={2.5} />
          ) : (
            <Pencil size={18} color="#49C593" strokeWidth={2} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
      >
        {/* ── Profile card ── */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>
              {(user?.full_name ?? 'U').charAt(0).toUpperCase()}
            </Text>
          </View>

          {editing ? (
            <View style={styles.editFields}>
              <TextInput
                style={styles.editInput}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Full Name"
                placeholderTextColor="#555"
              />
              <TextInput
                style={styles.editInput}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Phone Number"
                placeholderTextColor="#555"
                keyboardType="phone-pad"
              />
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.full_name ?? '—'}</Text>
              <Text style={styles.profileEmail}>{user?.email ?? '—'}</Text>
              {!!user?.phone_number && (
                <Text style={styles.profilePhone}>{user.phone_number}</Text>
              )}
            </View>
          )}
        </View>

        {/* ── Stats ── */}
        <Text style={styles.groupLabel}>Shipment Stats</Text>
        <View style={styles.statsRow}>
          <StatBox label="Total" value={stats?.total} loading={statsLoading} />
          <StatBox label="Active" value={stats?.active} loading={statsLoading} accent="#FFB300" />
          <StatBox label="Delivered" value={stats?.completed} loading={statsLoading} accent="#49C593" />
        </View>

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
          <SettingsRow label="Change Password" right={<ChevronRight size={16} color="#555" />} />
          <SettingsRow label="Delete Account" labelStyle={styles.dangerLabel} isLast
            right={<ChevronRight size={16} color="#555" />}
          />
        </SettingsGroup>

        {/* ── Sign out ── */}
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.7} onPress={handleSignOut}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* ── Version ── */}
        <Text style={styles.version}>AngoTrack v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

// ─── StatBox ──────────────────────────────────────────────────────────────────

function StatBox({
  label, value, loading, accent = '#FFFFFF',
}: { label: string; value?: number; loading: boolean; accent?: string }) {
  return (
    <View style={stat.box}>
      {loading ? (
        <ActivityIndicator size="small" color="#49C593" />
      ) : (
        <Text style={[stat.value, { color: accent }]}>{value ?? 0}</Text>
      )}
      <Text style={stat.label}>{label}</Text>
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
  backBtn:     { flexDirection: 'row', alignItems: 'center', minWidth: 70 },
  backText:    { color: '#FFFFFF', fontSize: 15, marginLeft: 2 },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  editBtn:     { minWidth: 70, alignItems: 'flex-end' },

  scrollContent: { paddingTop: 8 },

  // Profile card
  profileCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 20,
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#49C593',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { color: '#FFFFFF', fontSize: 30, fontWeight: '800' },
  profileInfo:   { alignItems: 'center', gap: 4 },
  profileName:   { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  profileEmail:  { color: '#888', fontSize: 14 },
  profilePhone:  { color: '#555', fontSize: 13 },

  editFields: { width: '100%', gap: 10 },
  editInput: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#49C593',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 24,
  },

  groupLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  rowRight:    { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowValue:    { color: '#666', fontSize: 14 },
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

  version: {
    color: '#333',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
  },
});

const stat = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 6,
  },
  value: { fontSize: 26, fontWeight: '800' },
  label: { color: '#666', fontSize: 12, fontWeight: '500' },
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
  border: { borderBottomWidth: 1, borderBottomColor: '#333' },
  label:  { color: '#FFFFFF', fontSize: 15 },
});
