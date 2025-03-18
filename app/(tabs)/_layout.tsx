import { Tabs } from 'expo-router';
import { Home, Users, MessageSquare, Settings } from 'lucide-react-native';
import { useThemeContext } from '../../components/ThemeProvider';

export default function TabLayout() {
  const { isDark } = useThemeContext();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
        },
        tabBarActiveTintColor: '#00FF00',
        tabBarInactiveTintColor: isDark ? '#888888' : '#666666',
        headerStyle: {
          backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
        },
        headerTintColor: isDark ? '#ffffff' : '#000000',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="buddies"
        options={{
          title: 'Buddies',
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="rooms"
        options={{
          title: 'Chat Rooms',
          tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
