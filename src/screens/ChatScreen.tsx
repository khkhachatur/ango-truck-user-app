import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Check, CheckCheck, Send } from 'lucide-react-native';
import { supabase, Message } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface Props {
  navigation?: any;
  route?: { params?: { load_id?: string; receiver_id: string } };
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ChatScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const loadId     = route?.params?.load_id ?? null;
  const receiverId = route?.params?.receiver_id ?? '';

  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  // ── Fetch history ────────────────────────────────────────────────────────────
  const fetchMessages = useCallback(async () => {
    if (!user) return;

    let query = supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),` +
        `and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`,
      )
      .order('created_at', { ascending: true });

    if (loadId) {
      query = query.eq('load_id', loadId);
    }

    const { data } = await query;
    if (data) setMessages(data as Message[]);
  }, [user, receiverId, loadId]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // ── Real-time subscription ────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`chat:${user.id}:${receiverId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const msg = payload.new as Message;
          const relevant =
            (msg.sender_id === user.id && msg.receiver_id === receiverId) ||
            (msg.sender_id === receiverId && msg.receiver_id === user.id);
          const loadMatch = loadId ? msg.load_id === loadId : true;
          if (relevant && loadMatch) {
            setMessages((prev) => [...prev, msg]);
          }
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages' },
        (payload) => {
          const updated = payload.new as Message;
          setMessages((prev) =>
            prev.map((m) => (m.id === updated.id ? updated : m)),
          );
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, receiverId, loadId]);

  // ── Mark as read on focus ────────────────────────────────────────────────────
  const markRead = useCallback(async () => {
    if (!user) return;
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('receiver_id', user.id)
      .eq('sender_id', receiverId)
      .eq('read', false);
  }, [user, receiverId]);

  useEffect(() => {
    const unsub = navigation?.addListener('focus', markRead);
    return unsub;
  }, [navigation, markRead]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  // ── Send ─────────────────────────────────────────────────────────────────────
  async function sendMessage() {
    const trimmed = body.trim();
    if (!trimmed || !user || sending) return;

    setSending(true);
    setBody('');

    await supabase.from('messages').insert({
      sender_id:   user.id,
      receiver_id: receiverId,
      load_id:     loadId ?? undefined,
      body:        trimmed,
      read:        false,
    });

    setSending(false);
  }

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Message list */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: 16 },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Bubble message={item} isMine={item.sender_id === user?.id} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No messages yet. Say hello!</Text>
        }
      />

      {/* Input bar */}
      <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TextInput
          style={styles.input}
          value={body}
          onChangeText={setBody}
          placeholder="Type a message…"
          placeholderTextColor="#555"
          multiline
          maxLength={1000}
          returnKeyType="default"
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!body.trim() || sending) && styles.sendBtnDisabled]}
          onPress={sendMessage}
          activeOpacity={0.7}
          disabled={!body.trim() || sending}
        >
          <Send size={18} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Bubble ───────────────────────────────────────────────────────────────────

function Bubble({ message, isMine }: { message: Message; isMine: boolean }) {
  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[bubble.row, isMine ? bubble.rowMine : bubble.rowTheirs]}>
      <View style={[bubble.wrap, isMine ? bubble.wrapMine : bubble.wrapTheirs]}>
        <Text style={[bubble.body, isMine ? bubble.bodyMine : bubble.bodyTheirs]}>
          {message.body}
        </Text>

        <View style={bubble.meta}>
          <Text style={[bubble.time, isMine ? bubble.timeMine : bubble.timeTheirs]}>
            {time}
          </Text>
          {isMine && (
            message.read
              ? <CheckCheck size={13} color="#49C593" strokeWidth={2.5} />
              : <Check size={13} color="rgba(255,255,255,0.5)" strokeWidth={2.5} />
          )}
        </View>
      </View>
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
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#121212',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2A2A2A',
  },
  headerTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },

  listContent: { paddingHorizontal: 16, paddingTop: 12, flexGrow: 1 },
  emptyText: {
    color: '#444',
    textAlign: 'center',
    marginTop: 60,
    fontSize: 14,
  },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: '#1A1A1A',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#2A2A2A',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: '#242424',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 15,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#49C593',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#2A2A2A' },
});

const bubble = StyleSheet.create({
  row:        { marginBottom: 6, flexDirection: 'row' },
  rowMine:    { justifyContent: 'flex-end' },
  rowTheirs:  { justifyContent: 'flex-start' },

  wrap: {
    maxWidth: '75%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  wrapMine: {
    backgroundColor: '#49C593',
    borderBottomRightRadius: 4,
  },
  wrapTheirs: {
    backgroundColor: '#1E1E1E',
    borderBottomLeftRadius: 4,
  },

  body:       { fontSize: 15, lineHeight: 21 },
  bodyMine:   { color: '#FFFFFF' },
  bodyTheirs: { color: '#EEEEEE' },

  meta:     { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, justifyContent: 'flex-end' },
  time:     { fontSize: 11 },
  timeMine: { color: 'rgba(255,255,255,0.65)' },
  timeTheirs:{ color: '#555' },
});
