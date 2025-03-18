import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { supabase } from '../lib/supabase';
import type { Theme } from '../lib/supabase';

export const useTheme = () => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: settings } = await supabase
      .from('user_settings')
      .select('theme')
      .eq('id', user.id)
      .single();

    if (settings) {
      setTheme(settings.theme);
    }
  };

  const updateTheme = async (newTheme: Theme) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('user_settings')
      .upsert({ id: user.id, theme: newTheme })
      .eq('id', user.id);

    setTheme(newTheme);
  };

  const currentTheme = theme === 'system' ? systemTheme : theme;

  return {
    theme,
    currentTheme,
    updateTheme,
    isDark: currentTheme === 'dark'
  };
};
