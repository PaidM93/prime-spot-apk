// src/components/FileCard.tsx
import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Dimensions, ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { PSFile } from '../api';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../theme';

const { width } = Dimensions.get('window');
const CARD_W = (width - 48) / 2;

type Props = {
  file: PSFile;
  onPress: () => void;
};

export default function FileCard({ file, onPress }: Props) {
  const { theme } = useTheme();

  const isVideo = file.mime_type?.includes('video') || !file.is_audio;
  const iconName = file.is_audio ? 'musical-notes' : 'play-circle';

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Thumbnail */}
      <View style={styles.thumbWrap}>
        {file.thumbnail ? (
          <ImageBackground
            source={{ uri: file.thumbnail }}
            style={styles.thumb}
            imageStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
            resizeMode="cover"
          >
            <View style={styles.thumbOverlay}>
              <Icon name={iconName} size={32} color="#fff" />
            </View>
          </ImageBackground>
        ) : (
          <View style={[styles.thumb, styles.thumbFallback]}>
            <Icon name={iconName} size={36} color={Colors.violet} />
          </View>
        )}
        {/* Type badge */}
        <View style={[styles.badge, { backgroundColor: isVideo ? Colors.violet : Colors.cyan }]}>
          <Text style={styles.badgeTxt}>{file.is_audio ? 'AUDIO' : 'VIDEO'}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
          {file.file_name}
        </Text>
        <View style={styles.meta}>
          <Text style={[styles.size, { color: theme.textMuted }]}>{file.file_size}</Text>
          {file.view_count > 0 && (
            <View style={styles.views}>
              <Icon name="eye-outline" size={11} color={theme.textMuted} />
              <Text style={[styles.viewTxt, { color: theme.textMuted }]}>
                {' '}{file.view_count}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  thumbWrap: { position: 'relative' },
  thumb: {
    width: '100%',
    height: CARD_W * 0.65,
    backgroundColor: '#0e0e24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbFallback: { backgroundColor: 'rgba(157,111,255,0.08)' },
  thumbOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeTxt: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  info: { padding: 8 },
  name: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    marginBottom: 4,
  },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  size: { fontSize: 11 },
  views: { flexDirection: 'row', alignItems: 'center' },
  viewTxt: { fontSize: 11 },
});
