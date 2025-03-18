import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Theme = 'light' | 'dark' | 'system';

export interface UserSettings {
  theme: Theme;
  notification_enabled: boolean;
  chat_sounds: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  status: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string | null;
  category: string;
  max_users: number;
}

export interface Message {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: UserProfile;
}

export interface Buddy {
  id: string;
  user_id: string;
  buddy_id: string;
  status: string;
  buddy?: UserProfile;
}
