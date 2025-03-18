import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import styles from '../styles';

type Message = {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
};

export default function Chat() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser();
    fetchMessages();
    
    const subscription = supabase
      .channel(`room:${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchMessages)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [id]);

  async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUserId(user.id);
  }

  async function fetchMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }
    
    setMessages(data);
  }

  async function sendMessage() {
    if (!newMessage.trim()) return;

    const { error } = await supabase
      .from('messages')
      .insert([
        {
          content: newMessage,
          room_id: id,
          user_id: userId,
        },
      ]);

    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    setNewMessage('');
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        inverted
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
        )}
      />
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 10 }]}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.button} onPress={sendMessage}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
