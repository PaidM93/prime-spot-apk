// src/navigation/index.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen   from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import WatchScreen  from '../screens/WatchScreen';
import { useTheme } from '../context/ThemeContext';
import { Colors }   from '../theme';
import { PSFile }   from '../api';

// ── Type definitions ──────────────────────────────────────────────
export type RootStackParamList = {
  Main:   undefined;
  Watch:  { file: PSFile };
  Search: undefined;
};

export type TabParamList = {
  Home:   undefined;
  Search: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator<TabParamList>();

// ── Bottom tab navigator ──────────────────────────────────────────
function TabNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor:  theme.tabBorder,
          borderTopWidth:  1,
          height: 58,
          paddingBottom: 6,
        },
        tabBarActiveTintColor:   Colors.violet,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else {
            iconName = focused ? 'search' : 'search-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home"   component={HomeScreen}   />
      <Tab.Screen name="Search" component={SearchScreen} />
    </Tab.Navigator>
  );
}

// ── Root stack navigator ──────────────────────────────────────────
export default function Navigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main"   component={TabNavigator} />
      <Stack.Screen name="Watch"  component={WatchScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}
