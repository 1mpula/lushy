import { useTheme } from '@/context/ThemeContext';

export function useColorScheme() {
  const { theme, toggleTheme, setTheme, isDark } = useTheme();
  
  return {
    colorScheme: theme,
    setColorScheme: setTheme,
    toggleColorScheme: toggleTheme,
  };
}
