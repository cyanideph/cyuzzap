import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { supabase } from '../lib/supabase';
import styles from './styles';

type Buddy = {
  id: string;
  username: string;
  status: string;
};

export default function Buddies() {
  const [buddies, setBuddies] = useState<Buddy[]>([]);

  useEffect(() => {
    fetchBuddies();
    const subscription = supabase
      .channel('public:buddies')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'buddies' }, fetchBuddies)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchBuddies() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('buddies')
      .select(`
        id,
        buddy:buddy_id(
          email,
          status
        )
      `)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error fetching buddies:', error);
      return;
    }
    
    setBuddies(data.map(buddy => ({
      id: buddy.id,
      username: buddy.buddy.email.split('@')[0],
      status: buddy.buddy.status || 'offline'
    })));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Buddy List</Text>
      </View>
      <FlatList
        data={buddies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.buddyItem}>
            <View style={[styles.statusIndicator, item.status === 'online' ? styles.online : styles.offline]} />
            <Text style={styles.buddyName}>{item.username}</Text>
          </View>
        )}
      />
    </View>
  );
}
