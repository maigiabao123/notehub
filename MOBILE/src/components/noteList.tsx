import React from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import type { Article } from '../services/noteService';
import NoteCard from './noteCard';

type Props = {
  notes: Article[];
  onNotePress?: (note: Article) => void;
  onLike?: (note: Article) => void;
};

const NoteList: React.FC<Props> = ({ notes, onNotePress, onLike }) => {
  const renderItem: ListRenderItem<Article> = ({ item }) => (
    <NoteCard
      note={item}
      onPress={onNotePress ? () => onNotePress(item) : undefined}
      onLike={onLike ? () => onLike(item) : undefined}
    />
  );

  return (
    <FlatList
      data={notes}
      keyExtractor={(item) => String(item.code)}
      renderItem={renderItem}
    />
  );
};

export default NoteList;