import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import styles from './styles';

type ChatRoom = {
  id: string;
  name: string;
  category: string;
  current_users: number;
};

export default function Rooms() {
  const router = useRouter();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    fetchRooms();
    const subscription = supabase
      .channel('public:chat_rooms')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_rooms' }, fetchRooms)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchRooms() {
    const { data, error } = await supabase
      .from('chat_rooms')
      .select('*')
      .order('category', { ascending: true });
    
    if (error) {
      console.error('Error fetching rooms:', error);
      return;
    }
    
    setRooms(data);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Chat Rooms</Text>
      </View>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatRoom}
            onPress={() => router.push(`/chat/${item.id}`)}
          >
            <Text style={styles.chatRoomText}>{item.name}</Text>
            <Text style={styles.chatRoomText}>({item.current_users}/20)</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
