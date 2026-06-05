// src/components/SearchBar.tsx
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../theme';

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  autoFocus?: boolean;
};

export default function SearchBar({
  value, onChangeText, onSubmit, placeholder = 'Search movies, series…', autoFocus,
}: Props) {
  const { theme } = useTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
      <Icon name="search-outline" size={18} color={theme.textMuted} style={styles.icon} />
      <TextInput
        style={[styles.input, { color: theme.text }]}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        returnKeyType="search"
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} style={styles.clear}>
          <Icon name="close-circle" size={17} color={theme.textMuted} />
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={onSubmit} style={styles.searchBtn}>
        <Icon name="arrow-forward-circle" size={26} color={Colors.violet} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 10,
    height: 46,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, padding: 0 },
  clear: { paddingHorizontal: 6 },
  searchBtn: { paddingLeft: 4 },
});
