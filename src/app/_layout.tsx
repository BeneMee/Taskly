import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useTaskStore } from '@/store/useTaskStore';
import { ThemeProvider, useTheme } from '@/theme';

function ThemedStack() {
  const t = useTheme();
  const modalOptions = {
    presentation: 'modal' as const,
    headerShown: true,
    headerStyle: { backgroundColor: t.colors.surface },
    headerTintColor: t.colors.text,
  };

  return (
    <>
      <StatusBar style={t.mode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: t.colors.background },
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="task/new" options={{ ...modalOptions, title: 'Neue Aufgabe' }} />
        <Stack.Screen
          name="task/[id]"
          options={{ ...modalOptions, title: 'Aufgabe bearbeiten' }}
        />
        <Stack.Screen name="category/list" options={{ ...modalOptions, title: 'Kategorien' }} />
        <Stack.Screen name="category/edit" options={{ ...modalOptions, title: 'Kategorie' }} />
        <Stack.Screen name="settings" options={{ ...modalOptions, title: 'Einstellungen' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const hydrated = useTaskStore((s) => s.hydrated);
  const registerOpen = useTaskStore((s) => s.registerOpen);

  // Sobald die persistierten Daten geladen sind: heutigen Tag für den Streak registrieren.
  useEffect(() => {
    if (hydrated) registerOpen();
  }, [hydrated, registerOpen]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ThemedStack />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
