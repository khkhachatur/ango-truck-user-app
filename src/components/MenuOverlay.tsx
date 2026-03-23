import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Animated,
  PanResponder,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  User,
  CreditCard,
  Heart,
  ClipboardList,
  MapPin,
  MessageCircle,
  Settings,
  Info,
  ChevronRight,
  LucideIcon,
} from 'lucide-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SPRING_CFG = { damping: 20, stiffness: 90, useNativeDriver: true } as const;

// ─── Props ────────────────────────────────────────────────────────────────────

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const insets = useSafeAreaInsets();
  const translateX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  // Backdrop opacity: 0 when fully off-screen → 0.5 when fully open
  const backdropOpacity = translateX.interpolate({
    inputRange: [-SCREEN_WIDTH, 0],
    outputRange: [0, 0.5],
    extrapolate: 'clamp',
  });

  // Respond to isOpen prop changes
  useEffect(() => {
    Animated.spring(translateX, {
      toValue: isOpen ? 0 : -SCREEN_WIDTH,
      ...SPRING_CFG,
    }).start();
  }, [isOpen]);

  // Swipe-left-to-close
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        g.dx < -5 && Math.abs(g.dx) > Math.abs(g.dy),

      onPanResponderMove: (_, g) => {
        if (g.dx < 0) translateX.setValue(g.dx);
      },

      onPanResponderRelease: (_, g) => {
        if (g.dx < -100 || g.vx < -0.5) {
          // Dismiss: animate off-screen then call onClose
          Animated.spring(translateX, {
            toValue: -SCREEN_WIDTH,
            ...SPRING_CFG,
          }).start(() => onClose());
        } else {
          // Snap back to open position
          Animated.spring(translateX, { toValue: 0, ...SPRING_CFG }).start();
        }
      },
    }),
  ).current;

  return (
    // pointerEvents="none" when closed so underlying screen stays interactive
    <View
      style={StyleSheet.absoluteFillObject}
      pointerEvents={isOpen ? 'auto' : 'none'}
    >
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Sliding panel */}
      <Animated.View
        style={[styles.panel, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        {/* Close button */}
        <TouchableOpacity
          style={[styles.closeBtn, { paddingTop: insets.top + 12 }]}
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
        >
          {/* Profile section */}
          <View style={styles.profile}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>K</Text>
            </View>
            <Text style={styles.profileName}>Khachatur</Text>
            <Text style={styles.profileEmail}>khachatur@mdvia.net</Text>
          </View>

          {/* Group 1 — Account */}
          <MenuGroup>
            <MenuItem icon={User}       title="My company"        />
            <MenuItem icon={CreditCard} title="Payment methods" isLast />
          </MenuGroup>

          {/* Group 2 — Activity */}
          <MenuGroup>
            <MenuItem icon={Heart}         title="Favorites"  />
            <MenuItem icon={ClipboardList} title="History"    />
            <MenuItem icon={MapPin}        title="Addresses"  />
            <MenuItem icon={MessageCircle} title="Support" isLast />
          </MenuGroup>

          {/* Group 3 — App */}
          <MenuGroup>
            <MenuItem icon={Settings} title="Settings"    />
            <MenuItem icon={Info}     title="Information" isLast />
          </MenuGroup>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

// ─── MenuGroup ────────────────────────────────────────────────────────────────

function MenuGroup({ children }: { children: React.ReactNode }) {
  return <View style={groupStyles.container}>{children}</View>;
}

// ─── MenuItem ─────────────────────────────────────────────────────────────────

interface MenuItemProps {
  icon: LucideIcon;
  title: string;
  isLast?: boolean;
}

function MenuItem({ icon: Icon, title, isLast = false }: MenuItemProps) {
  return (
    <TouchableOpacity
      style={[itemStyles.row, !isLast && itemStyles.border]}
      activeOpacity={0.7}
    >
      <View style={itemStyles.left}>
        <View style={itemStyles.iconWrap}>
          <Icon size={18} color="#FFFFFF" strokeWidth={1.8} />
        </View>
        <Text style={itemStyles.title}>{title}</Text>
      </View>
      <ChevronRight size={18} color="#555" />
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },

  panel: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    backgroundColor: '#121212',
  },

  closeBtn: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    alignSelf: 'flex-start',
  },

  scrollContent: {
    paddingTop: 8,
  },

  // Profile
  profile: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E1E1E',
    borderWidth: 2,
    borderColor: '#49C593',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarInitial: {
    color: '#49C593',
    fontSize: 32,
    fontWeight: '700',
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    color: '#888888',
    fontSize: 14,
  },
});

const groupStyles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: 'hidden',
  },
});

const itemStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
  },
});
