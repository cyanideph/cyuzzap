/*
  # Uzzap Clone Schema

  1. Tables
    - users (managed by Supabase Auth)
    - chat_rooms
      - id (uuid, primary key)
      - name (text)
      - category (text)
      - current_users (int)
      - created_at (timestamp)
    - messages
      - id (uuid, primary key)
      - content (text)
      - user_id (uuid, foreign key)
      - room_id (uuid, foreign key)
      - created_at (timestamp)
    - buddies
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - buddy_id (uuid, foreign key)
      - status (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create chat_rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  current_users int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id uuid REFERENCES chat_rooms(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create buddies table
CREATE TABLE IF NOT EXISTS buddies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  buddy_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'offline',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, buddy_id)
);

-- Enable RLS
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE buddies ENABLE ROW LEVEL SECURITY;

-- Chat rooms policies
CREATE POLICY "Allow authenticated users to view chat rooms"
  ON chat_rooms
  FOR SELECT
  TO authenticated
  USING (true);

-- Messages policies
CREATE POLICY "Allow authenticated users to view messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Buddies policies
CREATE POLICY "Users can view their own buddy list"
  ON buddies
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add buddies"
  ON buddies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create categories for chat rooms
INSERT INTO chat_rooms (name, category) VALUES
  ('Gamers 1', 'Games'),
  ('Gamers 2', 'Games'),
  ('Gamers 3', 'Games'),
  ('Music Lovers', 'Music'),
  ('Tech Talk', 'Technology'),
  ('Casual Chat', 'General')
ON CONFLICT DO NOTHING;
