import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useTaskStore } from '@/store/useTaskStore';
import { colors } from '@/theme';

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
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="task/new"
            options={{ presentation: 'modal', headerShown: true, title: 'Neue Aufgabe' }}
          />
          <Stack.Screen
            name="task/[id]"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'Aufgabe bearbeiten',
            }}
          />
          <Stack.Screen
            name="category/list"
            options={{ presentation: 'modal', headerShown: true, title: 'Kategorien' }}
          />
          <Stack.Screen
            name="category/edit"
            options={{ presentation: 'modal', headerShown: true, title: 'Kategorie' }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
