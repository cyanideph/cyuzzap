/*
  # Initial Schema Setup

  1. New Tables
    - `user_profiles`
      - Extended user information and preferences
    - `chat_rooms`
      - Public chat rooms
    - `messages`
      - Chat messages
    - `user_settings`
      - User preferences including theme
    - `user_buddies`
      - Friend relationships between users

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text UNIQUE NOT NULL,
  display_name text,
  avatar_url text,
  status text DEFAULT 'offline',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  theme text DEFAULT 'system',
  notification_enabled boolean DEFAULT true,
  chat_sounds boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Chat Rooms Table
CREATE TABLE IF NOT EXISTS chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  max_users integer DEFAULT 20,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read chat rooms"
  ON chat_rooms FOR SELECT
  TO authenticated
  USING (true);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read messages"
  ON messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- User Buddies Table
CREATE TABLE IF NOT EXISTS user_buddies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  buddy_id uuid REFERENCES auth.users(id),
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, buddy_id)
);

ALTER TABLE user_buddies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own buddy list"
  ON user_buddies FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = buddy_id);

CREATE POLICY "Users can insert buddy requests"
  ON user_buddies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
