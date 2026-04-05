import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const THEME_STORAGE_KEY = '@lushy_user_theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const { colorScheme: nwColorScheme, setColorScheme: setNativeWindColorScheme } = useNativeWindColorScheme();
  const [theme, setThemeState] = useState<Theme>(systemColorScheme === 'dark' ? 'dark' : 'light');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          const t = savedTheme as Theme;
          setThemeState(t);
          setNativeWindColorScheme(t);
        } else if (systemColorScheme) {
          setThemeState(systemColorScheme);
          setNativeWindColorScheme(systemColorScheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTheme();
  }, [systemColorScheme, setNativeWindColorScheme]);

  // Sync NativeWind if they get out of sync
  useEffect(() => {
    if (isLoaded && theme !== nwColorScheme) {
      setNativeWindColorScheme(theme);
    }
  }, [theme, nwColorScheme, isLoaded, setNativeWindColorScheme]);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    setNativeWindColorScheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
