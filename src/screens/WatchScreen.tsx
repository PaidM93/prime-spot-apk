// src/screens/WatchScreen.tsx
import React, { useRef, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Dimensions, ActivityIndicator,
  StatusBar, Linking, Share, Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Video, { OnLoadData, OnProgressData } from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import { useTheme } from '../context/ThemeContext';
import { Colors } from '../theme';
import { watchUrl } from '../api';
import type { RootStackParamList } from '../navigation';

type Route = RouteProp<RootStackParamList, 'Watch'>;

const { width: SW } = Dimensions.get('window');
const PLAYER_H = SW * (9 / 16);

export default function WatchScreen() {
  const navigation = useNavigation();
  const route      = useRoute<Route>();
  const { theme }  = useTheme();
  const { file }   = route.params;

  const videoRef   = useRef<any>(null);
  const [paused,   setPaused]   = useState(false);
  const [muted,    setMuted]    = useState(false);
  const [buffering,setBuffering]= useState(true);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [controls, setControls] = useState(true);
  const controlTimer            = useRef<any>(null);
  const [error,    setError]    = useState('');

  // Auto-hide controls after 3s
  const resetControlTimer = useCallback(() => {
    clearTimeout(controlTimer.current);
    setControls(true);
    controlTimer.current = setTimeout(() => setControls(false), 3000);
  }, []);

  const onLoad = (data: OnLoadData) => {
    setDuration(data.duration);
    setBuffering(false);
    resetControlTimer();
  };

  const onProgress = (data: OnProgressData) => {
    setProgress(data.currentTime);
  };

  const seek = (secs: number) => {
    const target = Math.min(Math.max(progress + secs, 0), duration);
    videoRef.current?.seek(target);
    setProgress(target);
    resetControlTimer();
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;

  const openInBrowser = () => {
    Linking.openURL(watchUrl(file.file_id));
  };

  const shareFile = () => {
    Share.share({
      title: file.file_name,
      url: watchUrl(file.file_id),
      message: `Watch "${file.file_name}" on Prime SpoT: ${watchUrl(file.file_id)}`,
    });
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.bg0 }]}>
      <StatusBar hidden />

      {/* ── VIDEO PLAYER ── */}
      <TouchableOpacity
        activeOpacity={1}
        style={styles.playerWrap}
        onPress={() => { setControls(c => !c); resetControlTimer(); }}
      >
        {error ? (
          <View style={styles.errPlayer}>
            <Icon name="warning-outline" size={40} color={Colors.red} />
            <Text style={styles.errTxt}>{error}</Text>
            <TouchableOpacity style={styles.openBrowserBtn} onPress={openInBrowser}>
              <Icon name="open-outline" size={14} color={Colors.cyan} />
              <Text style={styles.openBrowserTxt}> Open in Browser</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Video
            ref={videoRef}
            source={{ uri: file.file_url }}
            style={styles.video}
            paused={paused}
            muted={muted}
            resizeMode="contain"
            onLoad={onLoad}
            onProgress={onProgress}
            onBuffer={({ isBuffering }) => setBuffering(isBuffering)}
            onError={e => {
              setError(e.error?.errorString || 'Playback error');
              setBuffering(false);
            }}
            progressUpdateInterval={500}
            playInBackground={false}
          />
        )}

        {/* Buffering spinner */}
        {buffering && !error && (
          <View style={StyleSheet.absoluteFill}>
            <View style={styles.bufferOverlay}>
              <ActivityIndicator size="large" color={Colors.violet} />
            </View>
          </View>
        )}

        {/* Controls overlay */}
        {controls && !error && (
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent', 'rgba(0,0,0,0.85)']}
            style={StyleSheet.absoluteFill}
            pointerEvents="box-none"
          >
            {/* Back button */}
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

            {/* Center controls */}
            <View style={styles.centerControls} pointerEvents="box-none">
              <TouchableOpacity onPress={() => seek(-10)} style={styles.ctrlBtn}>
                <Icon name="play-back" size={28} color="#fff" />
                <Text style={styles.seekLabel}>10</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => { setPaused(p => !p); resetControlTimer(); }}
                style={styles.playBtn}
              >
                <Icon name={paused ? 'play' : 'pause'} size={36} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => seek(10)} style={styles.ctrlBtn}>
                <Icon name="play-forward" size={28} color="#fff" />
                <Text style={styles.seekLabel}>10</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom bar */}
            <View style={styles.bottomBar}>
              {/* Progress bar */}
              <View style={styles.progressWrap}>
                <View style={[styles.progressTrack, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${progressPct}%`, backgroundColor: Colors.violet },
                    ]}
                  />
                </View>
                <View style={styles.timeRow}>
                  <Text style={styles.timeLabel}>{formatTime(progress)}</Text>
                  <Text style={styles.timeLabel}>{formatTime(duration)}</Text>
                </View>
              </View>

              {/* Bottom icons */}
              <View style={styles.bottomIcons}>
                <TouchableOpacity onPress={() => setMuted(m => !m)} style={styles.iconBtn}>
                  <Icon
                    name={muted ? 'volume-mute' : 'volume-high'}
                    size={20} color="#fff"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={openInBrowser} style={styles.iconBtn}>
                  <Icon name="open-outline" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        )}
      </TouchableOpacity>

      {/* ── FILE INFO ── */}
      <ScrollView
        style={styles.info}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back on scroll view (when controls hidden) */}
        {!controls && (
          <TouchableOpacity
            style={styles.infoBack}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={20} color={theme.text} />
          </TouchableOpacity>
        )}

        <View style={styles.infoCard}>
          <Text style={[styles.fileName, { color: theme.text }]}>
            {file.file_name}
          </Text>

          <View style={styles.metaRow}>
            <View style={[styles.badge, { backgroundColor: 'rgba(157,111,255,0.15)' }]}>
              <Icon name="film-outline" size={11} color={Colors.violet} />
              <Text style={[styles.badgeTxt, { color: Colors.violet }]}>
                {' '}{file.mime_type?.split('/')[1]?.toUpperCase() || 'VIDEO'}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: 'rgba(0,245,212,0.1)' }]}>
              <Icon name="server-outline" size={11} color={Colors.cyan} />
              <Text style={[styles.badgeTxt, { color: Colors.cyan }]}>
                {' '}{file.file_size}
              </Text>
            </View>
            {file.view_count > 0 && (
              <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.06)' }]}>
                <Icon name="eye-outline" size={11} color={theme.textSub} />
                <Text style={[styles.badgeTxt, { color: theme.textSub }]}>
                  {' '}{file.view_count} views
                </Text>
              </View>
            )}
          </View>

          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: 'rgba(157,111,255,0.12)', borderColor: Colors.violet }]}
              onPress={shareFile}
            >
              <Icon name="share-social-outline" size={16} color={Colors.violet} />
              <Text style={[styles.actionTxt, { color: Colors.violet }]}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: 'rgba(0,245,212,0.08)', borderColor: Colors.cyan }]}
              onPress={openInBrowser}
            >
              <Icon name="globe-outline" size={16} color={Colors.cyan} />
              <Text style={[styles.actionTxt, { color: Colors.cyan }]}>Open Web</Text>
            </TouchableOpacity>
          </View>

          {/* File ID */}
          <View style={[styles.fileIdRow, { borderTopColor: theme.border }]}>
            <Icon name="fingerprint-outline" size={13} color={theme.textMuted} />
            <Text style={[styles.fileIdTxt, { color: theme.textMuted }]}>
              {' '}File ID: #{file.file_id}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1 },
  playerWrap: { width: SW, height: PLAYER_H, backgroundColor: '#000' },
  video:      { width: '100%', height: '100%' },
  bufferOverlay:{
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  errPlayer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#000',
  },
  errTxt: { color: Colors.red, marginTop: 8, fontSize: 13, textAlign: 'center' },
  openBrowserBtn: {
    flexDirection: 'row', alignItems: 'center', marginTop: 14,
    padding: 10, borderRadius: 20, borderWidth: 1, borderColor: Colors.cyan,
  },
  openBrowserTxt: { color: Colors.cyan, fontSize: 13, fontWeight: '700' },
  backBtn: { position: 'absolute', top: 14, left: 14, padding: 6 },
  centerControls: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 32,
  },
  ctrlBtn: { alignItems: 'center' },
  seekLabel: { color: '#fff', fontSize: 10, marginTop: 2 },
  playBtn: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(157,111,255,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 12, paddingBottom: 10 },
  progressWrap: { marginBottom: 8 },
  progressTrack: { height: 3, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  timeLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11 },
  bottomIcons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  iconBtn: { padding: 6 },

  info:     { flex: 1 },
  infoBack: { padding: 14 },
  infoCard: { padding: 16 },
  fileName: { fontSize: 16, fontWeight: '700', lineHeight: 22, marginBottom: 10 },
  metaRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  badge:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  badgeTxt: { fontSize: 11, fontWeight: '700' },
  actions:  { flexDirection: 'row', gap: 10, marginBottom: 16 },
  actionBtn:{
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, borderRadius: 12, borderWidth: 1,
  },
  actionTxt: { fontSize: 13, fontWeight: '700' },
  fileIdRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 14, borderTopWidth: 1 },
  fileIdTxt: { fontSize: 12 },
});
