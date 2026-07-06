import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import {
  Article,
  likeArticle,
  unlikeArticle,
} from '../../../../services/noteService';

type Props = {
  notes: Article[];
  loading?: boolean;
  onPressItem?: (note: Article) => void;
};

const NotesListView: React.FC<Props> = ({
  notes,
  loading,
  onPressItem,
}) => {
  const [data, setData] = useState<Article[]>([]);
  const [likedMap, setLikedMap] = useState<{ [code: number]: boolean }>({});

  useEffect(() => {
    setData(notes);
  }, [notes]);

  const toggleLike = async (note: Article) => {
    const liked = !!likedMap[note.code];

    setLikedMap(prev => ({
      ...prev,
      [note.code]: !liked,
    }));

    setData(prev =>
      prev.map(n =>
        n.code === note.code
          ? {
              ...n,
              luot_thich: (n.luot_thich || 0) + (liked ? -1 : 1),
            }
          : n,
      ),
    );

    try {
      if (liked) {
        await unlikeArticle(note.code);
      } else {
        await likeArticle(note.code);
      }
    } catch (e) {
      console.log('Error like/unlike', e);

      setLikedMap(prev => ({
        ...prev,
        [note.code]: liked,
      }));

      setData(prev =>
        prev.map(n =>
          n.code === note.code
            ? {
                ...n,
                luot_thich: (n.luot_thich || 0) + (liked ? 1 : -1),
              }
            : n,
        ),
      );
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (!data.length) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>Chưa có ghi chú nào</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.code.toString()}
      renderItem={({ item }) => {
        const liked = !!likedMap[item.code];

        return (
          <View
            style={{
              backgroundColor: '#fff',
              padding: 16,
              marginHorizontal: 12,
              marginVertical: 8,

              borderWidth: 1,
              borderColor: '#dbe3ec',
              borderRadius: 16,

              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.08,
              shadowRadius: 4,

              elevation: 3,
            }}
          >
            <Text
              style={{
                fontWeight: '700',
                fontSize: 16,
                marginBottom: 6,
              }}
            >
              {item.title}
            </Text>

            <Text
              numberOfLines={2}
              style={{
                color: '#444',
                lineHeight: 22,
              }}
            >
              {item.content}
            </Text>

            {/* Footer */}
            <View
              style={{
                marginTop: 14,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {/* Xem chi tiết */}
              <TouchableOpacity
                onPress={() => onPressItem?.(item)}
                style={{
                  backgroundColor: '#1a73e8',
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: '600',
                  }}
                >
                  Xem chi tiết
                </Text>
              </TouchableOpacity>

              {/* Like */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <TouchableOpacity
                  onPress={() => toggleLike(item)}
                >
                  <FontAwesome
                    name={liked ? 'heart' : 'heart-o'}
                    size={20}
                    color={liked ? 'red' : 'grey'}
                  />
                </TouchableOpacity>

                <Text
                  style={{
                    marginLeft: 6,
                    fontSize: 15,
                  }}
                >
                  {item.luot_thich ?? 0}
                </Text>
              </View>
            </View>
          </View>
        );
      }}
    />
  );
};

export default NotesListView;