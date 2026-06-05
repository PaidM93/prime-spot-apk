// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import Navigation from './src/navigation';

function ThemedApp() {
  const { mode } = useTheme();

  return (
    <NavigationContainer
      theme={{
        dark: mode === 'dark',
        colors: {
          primary:       '#9d6fff',
          background:    mode === 'dark' ? '#04040f' : '#f0f4f8',
          card:          mode === 'dark' ? '#08081a' : '#ffffff',
          text:          mode === 'dark' ? '#f1f5f9' : '#0f172a',
          border:        mode === 'dark' ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.1)',
          notification:  '#9d6fff',
        },
      }}
    >
      <Navigation />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
