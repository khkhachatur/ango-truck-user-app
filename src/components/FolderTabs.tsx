import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BRAND      = '#49C593';
const DARK_CARD  = '#2A2A2A';
const TAB_WIDTH  = 110; // each tab is this wide

export type TabKey = 'city' | 'intercity';

interface FolderTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  /** Pass selectedSize + truckImage so the card re-renders inside the component */
  children?: React.ReactNode;
}

export default function FolderTabs({ activeTab, onTabChange, children }: FolderTabsProps) {
  // 0 = city, 1 = intercity
  const tabIndex = useRef(new Animated.Value(activeTab === 'city' ? 0 : 1)).current;

  useEffect(() => {
    Animated.spring(tabIndex, {
      toValue: activeTab === 'city' ? 0 : 1,
      damping: 20,
      stiffness: 100,
      useNativeDriver: false, // needed for color interpolation & border radius
    }).start();
  }, [activeTab]);

  // ── Sliding background translateX ──────────────────────────────────────────
  const sliderX = tabIndex.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, TAB_WIDTH],
  });

  // ── City tab text color  (active=white when index=0, dim when index=1) ─────
  const cityColor = tabIndex.interpolate({
    inputRange:  [0, 1],
    outputRange: ['#49C593', '#FFFFFF'],
  });

  // ── Intercity tab text color (white when index=0, active=green when index=1) ─
  const intercityColor = tabIndex.interpolate({
    inputRange:  [0, 1],
    outputRange: ['#FFFFFF', '#49C593'],
  });

  // ── Card top-left radius: 0 when city active, 16 when intercity active ─────
  const cardTopLeft = tabIndex.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, 16],
  });

  // ── Card top-right radius: 16 when city active, 0 when intercity active ────
  const cardTopRight = tabIndex.interpolate({
    inputRange:  [0, 1],
    outputRange: [16, 0],
  });

  return (
    <>
      {/* ── Tab row ── */}
      <View style={styles.tabRow}>
        {/* Sliding dark background */}
        <Animated.View
          style={[
            styles.slider,
            { transform: [{ translateX: sliderX }] },
          ]}
        />

        {/* City-wide button */}
        <Pressable
          style={styles.tabBtn}
          onPress={() => onTabChange('city')}
        >
          <Animated.Text style={[styles.tabText, { color: cityColor }]}>
            City-wide
          </Animated.Text>
        </Pressable>

        {/* Intercity button */}
        <Pressable
          style={styles.tabBtn}
          onPress={() => onTabChange('intercity')}
        >
          <Animated.Text style={[styles.tabText, { color: intercityColor }]}>
            Intercity
          </Animated.Text>
        </Pressable>
      </View>

      {/* ── Truck card — radius animates to create folder connection ── */}
      <Animated.View
        style={[
          styles.card,
          {
            borderTopLeftRadius:  cardTopLeft,
            borderTopRightRadius: cardTopRight,
          },
        ]}
      >
        {children}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  // Tab row
  tabRow: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    width: TAB_WIDTH * 2,
    position: 'relative',
  },

  // Sliding dark pill (absolutely positioned inside the row)
  slider: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: TAB_WIDTH,
    height: '100%',
    backgroundColor: DARK_CARD,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  // Tab buttons
  tabBtn: {
    width: TAB_WIDTH,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, // above the slider
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Truck card
  card: {
    backgroundColor: DARK_CARD,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
});
