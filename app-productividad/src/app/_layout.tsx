import { DarkTheme, DefaultTheme, Tabs, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Tabs screenOptions={{ headerShown: false, tabBarPosition: 'bottom' }}>
        <Tabs.Screen name="index" options={{ title: 'Hoy', tabBarIcon: ({ color }) => <SymbolView name="house.fill" tintColor={color} size={22} /> }} />
        <Tabs.Screen name="projects" options={{ title: 'Proyectos', tabBarIcon: ({ color }) => <SymbolView name="square.stack.3d.up.fill" tintColor={color} size={22} /> }} />
        <Tabs.Screen name="calendar" options={{ title: 'Agenda', tabBarIcon: ({ color }) => <SymbolView name="calendar" tintColor={color} size={22} /> }} />
        <Tabs.Screen name="notes" options={{ title: 'Notas', tabBarIcon: ({ color }) => <SymbolView name="note.text" tintColor={color} size={22} /> }} />
      </Tabs>
    </ThemeProvider>
  );
}
