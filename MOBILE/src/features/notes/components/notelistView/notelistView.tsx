// src/features/notes/components/notelistView/notelistView.tsx
import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';

type Note = {
  id: string;
  title: string;
  content: string;
};

type Props = {
  notes: Note[];
  loading?: boolean;
  onPressItem?: (note: Note) => void;
};

const NotesListView: React.FC<Props> = ({ notes, loading, onPressItem }) => {
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!notes.length) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Chưa có ghi chú nào</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notes}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onPressItem && onPressItem(item)}
          style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}
        >
          <Text style={{ fontWeight: '600' }}>{item.title}</Text>
          <Text numberOfLines={2}>{item.content}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default NotesListView;