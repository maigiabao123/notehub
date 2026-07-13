import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
interface Note {
  code: string | number;
  title: string;
  content: string;
  time: string;
  luot_thich: number;
  type_article: string;
}
import { Platform } from 'react-native';
const Khacscreen: React.FC = () => {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ================== THAY ĐỔI ĐỊA CHỈ NÀY ==================
  // ✅ BASE URL chung cho web + android
  const API_URL =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:5000'   // Android
      : 'http://localhost:5000'; // Web

  const fetchKhacNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/khac`);

      if (!response.ok) {
        throw new Error('Lỗi server');
      }

      const data = await response.json();
      setNotes(data.articles || []);
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể kết nối với server. Kiểm tra backend Flask đang chạy chưa?');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchKhacNotes();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchKhacNotes();
  };

  const renderNote = ({ item }: { item: Note }) => (
    <TouchableOpacity style={styles.noteCard} onPress={() => {
      // TODO: Mở chi tiết note
      Alert.alert(item.title, item.content);
    }}>
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.noteContent} numberOfLines={3}>
        {item.content}
      </Text>
      <Text style={styles.noteMeta}>
        ❤️ Lượt thích: {item.luot_thich} | {item.time}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.brand}>NoteHub</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add_note')}
        >
          <Text style={styles.addButtonText}>+ Thêm ghi chú mới</Text>
        </TouchableOpacity>
      </View>

      {/* Tiêu đề trang */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>🎓 Ghi chú khác</Text>
      </View>

      {/* Danh sách ghi chú */}
      <FlatList
        data={notes}
        keyExtractor={(item) => String(item.code)}
        renderItem={renderNote}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 100 }} />
          ) : (
            <Text style={styles.emptyText}>Chưa có ghi chú học tập nào.</Text>
          )
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logo: { fontSize: 24, fontWeight: '700', color: '#2563eb' },
  addButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addButtonText: { color: 'white', fontWeight: '600', fontSize: 15 },

  titleContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: { fontSize: 22, fontWeight: '700' },

  listContent: { padding: 15 },
  noteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  noteTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  noteContent: { fontSize: 15, color: '#374151', lineHeight: 22, marginBottom: 10 },
  noteMeta: { fontSize: 13, color: '#6b7280' },
  emptyText: { textAlign: 'center', marginTop: 100, fontSize: 16, color: '#9ca3af' },
  brand: {
    fontSize: 18, color: "rgba(26, 115, 232, 1.00)", fontWeight: "800"
  }
});

export default Khacscreen;