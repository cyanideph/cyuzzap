import React from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { useThemeContext } from '../../components/ThemeProvider';
import { supabase } from '../../lib/supabase';
import { Moon, Sun, Monitor } from 'lucide-react-native';

export default function SettingsScreen() {
  const { theme, updateTheme, isDark } = useThemeContext();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [chatSounds, setChatSounds] = React.useState(true);

  const updateSettings = async (setting: string, value: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('user_settings')
      .upsert({
        id: user.id,
        [setting]: value,
      })
      .eq('id', user.id);

    if (setting === 'notification_enabled') {
      setNotificationsEnabled(value);
    } else if (setting === 'chat_sounds') {
      setChatSounds(value);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: isDark ? '#000000' : '#ffffff',
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      color: isDark ? '#ffffff' : '#000000',
    },
    themeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginBottom: 8,
      borderRadius: 8,
      backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
    },
    themeButtonActive: {
      backgroundColor: '#00FF00',
    },
    themeText: {
      marginLeft: 12,
      fontSize: 16,
      color: isDark ? '#ffffff' : '#000000',
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
      borderRadius: 8,
      marginBottom: 8,
    },
    settingText: {
      fontSize: 16,
      color: isDark ? '#ffffff' : '#000000',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme</Text>
        <TouchableOpacity
          style={[styles.themeButton, theme === 'light' && styles.themeButtonActive]}
          onPress={() => updateTheme('light')}>
          <Sun color={isDark ? '#ffffff' : '#000000'} />
          <Text style={styles.themeText}>Light</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.themeButton, theme === 'dark' && styles.themeButtonActive]}
          onPress={() => updateTheme('dark')}>
          <Moon color={isDark ? '#ffffff' : '#000000'} />
          <Text style={styles.themeText}>Dark</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.themeButton, theme === 'system' && styles.themeButtonActive]}
          onPress={() => updateTheme('system')}>
          <Monitor color={isDark ? '#ffffff' : '#000000'} />
          <Text style={styles.themeText}>System</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={(value) => updateSettings('notification_enabled', value)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notificationsEnabled ? '#00FF00' : '#f4f3f4'}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Chat Sounds</Text>
          <Switch
            value={chatSounds}
            onValueChange={(value) => updateSettings('chat_sounds', value)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={chatSounds ? '#00FF00' : '#f4f3f4'}
          />
        </View>
      </View>
    </View>
  );
}
