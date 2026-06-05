// src/screens/SearchScreen.tsx
import React, { useState, useRef, useCallback } from 'react';
import {
  View, FlatList, Text, StyleSheet,
  ActivityIndicator, TouchableOpacity, Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { searchFiles, PSFile } from '../api';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../theme';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import FileCard from '../components/FileCard';
import type { RootStackParamList } from '../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Main'>;

type State = 'idle' | 'loading' | 'done' | 'error';

export default function SearchScreen() {
  const navigation = useNavigation<Nav>();
  const { theme } = useTheme();

  const [query, setQuery]       = useState('');
  const [files, setFiles]       = useState<PSFile[]>([]);
  const [page, setPage]         = useState(1);
  const [totalPages, setTotal]  = useState(1);
  const [state, setState]       = useState<State>('idle');
  const [loadingMore, setMore]  = useState(false);
  const [error, setError]       = useState('');
  const lastQuery               = useRef('');

  const doSearch = useCallback(async (q: string, p: number, reset = false) => {
    if (!q.trim()) return;
    try {
      setError('');
      const res = await searchFiles(q.trim(), p);
      setFiles(prev => reset ? res.files : [...prev, ...res.files]);
      setTotal(res.pages);
      setPage(p);
    } catch (e: any) {
      setError(e?.message || 'Search failed');
      setState('error');
    }
  }, []);

  const onSubmit = async () => {
    if (!query.trim()) return;
    Keyboard.dismiss();
    lastQuery.current = query.trim();
    setState('loading');
    await doSearch(query.trim(), 1, true);
    setState('done');
  };

  const onEndReached = async () => {
    if (loadingMore || page >= totalPages || state !== 'done') return;
    setMore(true);
    await doSearch(lastQuery.current, page + 1);
    setMore(false);
  };

  const openFile = (file: PSFile) => {
    navigation.navigate('Watch', { file });
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.bg0 }]}>
      <Header title="Search" />

      <SearchBar
        value={query}
        onChangeText={setQuery}
        onSubmit={onSubmit}
        autoFocus
      />

      {state === 'idle' && (
        <View style={styles.center}>
          <Icon name="search-circle-outline" size={64} color="rgba(157,111,255,0.25)" />
          <Text style={[styles.hint, { color: theme.textMuted }]}>
            Search for movies, series, audio…
          </Text>
        </View>
      )}

      {state === 'loading' && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.violet} />
          <Text style={[styles.hint, { color: theme.textMuted }]}>
            Searching "{query}"…
          </Text>
        </View>
      )}

      {state === 'error' && (
        <View style={styles.center}>
          <Icon name="warning-outline" size={48} color={Colors.red} />
          <Text style={[styles.hint, { color: Colors.red }]}>{error}</Text>
          <TouchableOpacity
            style={[styles.retryBtn, { borderColor: Colors.violet }]}
            onPress={onSubmit}
          >
            <Text style={{ color: Colors.violet, fontWeight: '700' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {state === 'done' && (
        <FlatList
          data={files}
          keyExtractor={f => String(f.file_id)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <FileCard file={item} onPress={() => openFile(item)} />
          )}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loadingMore
              ? <ActivityIndicator color={Colors.violet} style={{ marginVertical: 16 }} />
              : null
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Icon name="file-tray-outline" size={52} color={theme.textMuted} />
              <Text style={[styles.hint, { color: theme.textMuted }]}>
                No results for "{lastQuery.current}"
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1 },
  center:  { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  hint:    { marginTop: 12, fontSize: 14, textAlign: 'center' },
  list:    { paddingHorizontal: 12, paddingBottom: 24, paddingTop: 4 },
  row:     { justifyContent: 'space-between' },
  retryBtn:{
    marginTop: 16, paddingHorizontal: 24, paddingVertical: 10,
    borderRadius: 20, borderWidth: 1,
  },
});
