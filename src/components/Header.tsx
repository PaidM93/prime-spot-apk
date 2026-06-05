// src/components/Header.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../theme';

type Props = {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
};

export default function Header({ title = 'Prime SpoT', showBack, onBack, right }: Props) {
  const { theme, mode, toggleTheme } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: theme.bg1, borderBottomColor: theme.border }]}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg1}
      />

      <View style={styles.left}>
        {showBack ? (
          <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
            <Icon name="arrow-back" size={22} color={theme.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.logo}>
            <Icon name="robot" size={18} color="#fff" />
          </View>
        )}
      </View>

      <Text style={[styles.title, { color: Colors.violet }]}>{title}</Text>

      <View style={styles.right}>
        {right || (
          <TouchableOpacity onPress={toggleTheme} style={styles.iconBtn}>
            <Icon
              name={mode === 'dark' ? 'sunny-outline' : 'moon-outline'}
              size={20}
              color={theme.text}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  left: { width: 44, alignItems: 'flex-start' },
  right: { width: 44, alignItems: 'flex-end' },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  iconBtn: { padding: 4 },
});
