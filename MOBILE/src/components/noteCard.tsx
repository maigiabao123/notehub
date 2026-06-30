// components/NoteCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Article } from '../services/noteService';

interface Props {
  note: Article;
  onPress?: () => void;
  onLike?: () => void;
}

const NoteCard: React.FC<Props> = ({ note, onPress, onLike }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Text style={styles.title}>{note.title}</Text>

      <Text numberOfLines={4} style={styles.content}>
        {(note as any).content || (note as any).description || ''}
      </Text>

      <Text style={styles.metaText}>Mã: {note.code}</Text>

      <TouchableOpacity style={styles.likeBtn} onPress={onLike}>
        <Text style={styles.likeText}>♡ Thả tim</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: { fontSize: 15, fontWeight: '700', marginBottom: 6 },
  content: { fontSize: 13, color: '#444', marginBottom: 8 },
  metaText: { fontSize: 11, color: '#777' },
  likeBtn: {
    marginTop: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ff5c7a',
    paddingVertical: 6,
    alignItems: 'center',
  },
  likeText: { fontSize: 13, color: '#ff5c7a', fontWeight: '500' },
});

export default NoteCard;