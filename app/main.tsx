import React from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

export default function Main() {
  const router = useRouter();

  const menuItems = [
    { icon: 'chatbubbles', label: 'Chat Rooms', route: '/rooms' },
    { icon: 'people', label: 'Buddy List', route: '/buddies' },
    { icon: 'musical-notes', label: 'Music', route: '/music' },
    { icon: 'game-controller', label: 'Games', route: '/games' },
    { icon: 'settings', label: 'Settings', route: '/settings' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Main Menu - Beta</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Ionicons name="settings" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => router.push(item.route)}
          >
            <Ionicons name={item.icon} size={24} color="white" />
            <Text style={styles.menuText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
