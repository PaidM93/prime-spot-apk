// src/screens/HomeScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  View, FlatList, Text, StyleSheet,
  RefreshControl, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import { fetchFiles, PSFile } from '../api';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../theme';
import Header from '../components/Header';
import FileCard from '../components/FileCard';
import type { RootStackParamList } from '../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { theme } = useTheme();

  const [files, setFiles]       = useState<PSFile[]>([]);
  const [page, setPage]         = useState(1);
  const [totalPages, setTotal]  = useState(1);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefresh]= useState(false);
  const [loadingMore, setMore]  = useState(false);
  const [error, setError]       = useState('');

  const load = useCallback(async (p: number, reset = false) => {
    try {
      setError('');
      const res = await fetchFiles(p, 20);
      setFiles(prev => reset ? res.files : [...prev, ...res.files]);
      setTotal(res.pages);
      setPage(p);
    } catch (e: any) {
      setError(e?.message || 'Failed to load files');
    }
  }, []);

  useEffect(() => { load(1, true).finally(() => setLoading(false)); }, [load]);

  const onRefresh = async () => {
    setRefresh(true);
    await load(1, true);
    setRefresh(false);
  };

  const onEndReached = async () => {
    if (loadingMore || page >= totalPages) return;
    setMore(true);
    await load(page + 1);
    setMore(false);
  };

  const openFile = (file: PSFile) => {
    navigation.navigate('Watch', { file });
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg0 }]}>
        <ActivityIndicator size="large" color={Colors.violet} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.bg0 }]}>
      <Header />

      {/* Hero banner */}
      <LinearGradient
        colors={['rgba(157,111,255,0.18)', 'transparent']}
        style={styles.hero}
      >
        <Text style={[styles.heroTitle, { color: theme.text }]}>
          🎬 Latest Uploads
        </Text>
        <TouchableOpacity
          style={styles.searchHint}
          onPress={() => navigation.navigate('Search')}
        >
          <Icon name="search" size={14} color={Colors.cyan} />
          <Text style={[styles.searchHintTxt, { color: Colors.cyan }]}> Search…</Text>
        </TouchableOpacity>
      </LinearGradient>

      {error ? (
        <View style={styles.center}>
          <Icon name="cloud-offline-outline" size={48} color={theme.textMuted} />
          <Text style={[styles.errTxt, { color: theme.textMuted }]}>{error}</Text>
          <TouchableOpacity
            style={[styles.retryBtn, { borderColor: Colors.violet }]}
            onPress={() => load(1, true)}
          >
            <Text style={{ color: Colors.violet, fontWeight: '700' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={files}
          keyExtractor={f => String(f.file_id)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <FileCard file={item} onPress={() => openFile(item)} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.violet}
              colors={[Colors.violet]}
            />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loadingMore
              ? <ActivityIndicator color={Colors.violet} style={{ marginVertical: 16 }} />
              : null
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Icon name="film-outline" size={52} color={theme.textMuted} />
              <Text style={[styles.errTxt, { color: theme.textMuted }]}>No files yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root:  { flex: 1 },
  center:{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  heroTitle: { fontSize: 16, fontWeight: '800' },
  searchHint: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0,245,212,0.08)',
  },
  searchHintTxt: { fontSize: 13, fontWeight: '600' },
  list: { paddingHorizontal: 12, paddingBottom: 24 },
  row:  { justifyContent: 'space-between', marginBottom: 0 },
  errTxt:  { marginTop: 12, fontSize: 14, textAlign: 'center' },
  retryBtn: {
    marginTop: 16, paddingHorizontal: 24, paddingVertical: 10,
    borderRadius: 20, borderWidth: 1,
  },
});
