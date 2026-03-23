import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
  PanResponder,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mail, Lock, User } from 'lucide-react-native';
import GreenButton from '../components/GreenButton';
import InputField from '../components/InputField';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.75;
const DISMISS_THRESHOLD = 150;  // px dragged down to dismiss
const DISMISS_VELOCITY = 0.5;   // PanResponder velocity units to dismiss on flick

const SPRING_OPEN   = { toValue: 0,            damping: 20, stiffness: 90, useNativeDriver: true };
const SPRING_CLOSED = { toValue: SHEET_HEIGHT, damping: 20, stiffness: 90, useNativeDriver: true };

type ActiveForm = 'signin' | 'signup' | null;

interface Props {
  navigation?: any;
}

export default function AuthScreen({ navigation }: Props) {
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]       = useState('');
  const insets = useSafeAreaInsets();

  // Sheet offset: 0 = fully open, SHEET_HEIGHT = off-screen below
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  function animateOpen() {
    Animated.spring(translateY, SPRING_OPEN).start();
  }

  function animateClose(onDone?: () => void) {
    Animated.spring(translateY, SPRING_CLOSED).start(onDone);
  }

  function openSheet(form: ActiveForm) {
    setActiveForm(form);
    animateOpen();
  }

  function closeSheet() {
    animateClose(() => setActiveForm(null));
  }

  // ── Swipe-to-dismiss gesture ───────────────────────────────────────────────
  const panResponder = useRef(
    PanResponder.create({
      // Only claim the gesture if the user starts dragging downward
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5 && Math.abs(g.dy) > Math.abs(g.dx),

      onPanResponderMove: (_, g) => {
        // Clamp at 0: sheet cannot be dragged above its open position
        translateY.setValue(Math.max(0, g.dy));
      },

      onPanResponderRelease: (_, g) => {
        const shouldDismiss = g.dy > DISMISS_THRESHOLD || g.vy > DISMISS_VELOCITY;
        if (shouldDismiss) {
          animateClose(() => setActiveForm(null));
        } else {
          animateOpen(); // snap back
        }
      },
    }),
  ).current;

  const isSignUp = activeForm === 'signup';

  return (
    <ImageBackground
      source={require('../../assets/welcome-bg.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Back button (above the sheet, visible when open) ── */}
      {activeForm !== null && (
        <TouchableOpacity
          style={[styles.backBtn, { top: insets.top + 16 }]}
          onPress={closeSheet}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
      )}

      {/* ── Welcome text ── */}
      {activeForm === null && (
        <View style={styles.centerText}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>
            Enter personal details to see your Orders
          </Text>
        </View>
      )}

      {/* ── Sign in / Sign up tab buttons ── */}
      {activeForm === null && (
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.signInBtn}
            onPress={() => openSheet('signin')}
            activeOpacity={0.7}
          >
            <Text style={styles.signInText}>Sign in</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.signUpBtn, { paddingBottom: Math.max(insets.bottom, 20) }]}
            onPress={() => openSheet('signup')}
            activeOpacity={0.85}
          >
            <Text style={styles.signUpText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Animated bottom sheet ── */}
      <Animated.View style={[styles.sheet, { height: SHEET_HEIGHT, transform: [{ translateY }] }]}>

        {/* Drag indicator — attach pan responder only here so scroll still works below */}
        <View {...panResponder.panHandlers} style={styles.dragHandle}>
          <View style={styles.dragIndicator} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={[
              styles.sheetContent,
              { paddingBottom: Math.max(insets.bottom, 24) + 16 },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.sheetTitle}>
              {isSignUp ? 'Get Started' : 'Welcome Back'}
            </Text>

            <View style={styles.fields}>
              {isSignUp && (
                <InputField
                  placeholder="Full Name"
                  value={name}
                  onChangeText={setName}
                  Icon={User}
                  light
                />
              )}
              <InputField
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                Icon={Mail}
                light
              />
              <InputField
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                Icon={Lock}
                light
                secureTextEntry
              />
            </View>

            <GreenButton
              label={isSignUp ? 'Create Account' : 'Sign In'}
              onPress={() => navigation?.replace('MapHome')}
            />

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerLabel}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              <SocialButton label="f"  bg="#1877F2" textColor="#FFFFFF" />
              <SocialButton label="G"  bg="#FFFFFF"  textColor="#EA4335" bordered />
              <SocialButton label=""  bg="#000000" textColor="#FFFFFF" />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
    </ImageBackground>
  );
}

// ─── Social button ─────────────────────────────────────────────────────────────

function SocialButton({
  label, bg, textColor, bordered = false,
}: { label: string; bg: string; textColor: string; bordered?: boolean }) {
  return (
    <TouchableOpacity
      style={[styles.socialBtn, { backgroundColor: bg }, bordered && styles.socialBtnBorder]}
      activeOpacity={0.75}
    >
      <Text style={[styles.socialBtnText, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bg: { flex: 1 },

  backBtn: { position: 'absolute', left: 20, zIndex: 10 },
  backText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  centerText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title:    { color: '#FFFFFF', fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { color: '#FFFFFF', fontSize: 14, textAlign: 'center', opacity: 0.85, lineHeight: 20 },

  bottomRow: { flexDirection: 'row', width: '100%' },
  signInBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 22 },
  signInText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  signUpBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingTop: 22, backgroundColor: '#FFFFFF', borderTopLeftRadius: 50,
  },
  signUpText: { color: '#1B5E20', fontSize: 16, fontWeight: '700' },

  // Sheet
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40, borderTopRightRadius: 40,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12, shadowRadius: 16, elevation: 20,
  },
  dragHandle: {
    width: '100%', alignItems: 'center', paddingVertical: 14,
  },
  dragIndicator: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: '#CCCCCC',
  },

  sheetContent: { paddingHorizontal: 28, paddingTop: 12, flexGrow: 1 },
  sheetTitle: {
    color: '#1B5E20', fontSize: 26, fontWeight: '800',
    textAlign: 'center', marginBottom: 28,
  },

  fields: { gap: 14, marginBottom: 24 },

  dividerRow: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 24, marginBottom: 20, gap: 10,
  },
  dividerLine:  { flex: 1, height: 1, backgroundColor: '#E8E8E8' },
  dividerLabel: { color: '#AAAAAA', fontSize: 12, fontWeight: '500' },

  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  socialBtn: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  socialBtnBorder: { borderWidth: 1.5, borderColor: '#E0E0E0' },
  socialBtnText: { fontSize: 18, fontWeight: '800' },
});
