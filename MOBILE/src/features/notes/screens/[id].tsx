// features/notes/screens/[id].tsx
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { jwtDecode } from 'jwt-decode';

const { width } = Dimensions.get('window');

interface Note {
  id: number;
  title: string;
  type: string;
  code: string;
  createdAt: string;
  content: string;
  likes: number;
  authorId: number;
}

interface DecodedToken {
  user_id: number;
}

export default function NoteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const note: Note = {
    id: 16,
    title: "3/7 - hoc tap",
    type: "hoctap",
    code: "16",
    createdAt: "2026-07-03",
    content: "Hôm nay tôi đã hoàn thành các bài tập được giao và dành thêm thời gian để ôn lại kiến thức cũ. Việc học đều đặn giúp tôi tự tin hơn và chuẩn bị tốt cho những kỳ kiểm tra sắp tới. Tôi sẽ tiếp tục cố gắng để đạt kết quả tốt hơn.",
    likes: 1,
    authorId: 13,
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setCurrentUserId(decoded.user_id);
      } catch (err) {}
    }
  }, []);

  const isOwner = currentUserId === note.authorId;

  const handleDelete = () => {
    Alert.alert('Xác nhận', 'Xóa ghi chú này?', [
      { text: 'Hủy' },
      { text: 'Xóa', style: 'destructive', onPress: () => router.push('/') }
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.logo}>NoteHub</Text>
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <TextInput style={styles.searchInput} placeholder="Tìm kiếm ghi chú..." />
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Thêm</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content - Responsive */}
      <ScrollView style={styles.mainContent} contentContainerStyle={styles.scrollContent}>
        <View style={styles.noteCard}>
          <View style={styles.titleRow}>
            <Text style={styles.noteTitle}>{note.title}</Text>

            {isOwner && (
              <View style={styles.actionGroup}>
                <TouchableOpacity style={styles.editBtn} onPress={() => alert('Chức năng sửa')}>
                  <Text style={styles.editText}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                  <Text style={styles.deleteText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.label}>Loại</Text>
              <View style={styles.tag}><Text style={styles.tagText}>{note.type}</Text></View>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.label}>Mã</Text>
              <Text style={styles.value}>{note.code}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.label}>Ngày</Text>
              <Text style={styles.value}>{note.createdAt}</Text>
            </View>
          </View>

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Nội dung</Text>
          <Text style={styles.noteContent}>{note.content}</Text>

          {/* Thông tin */}
          <View style={styles.infoSection}>
            <Text style={styles.sidebarTitle}>THÔNG TIN GHI CHÚ</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📅</Text>
              <Text style={styles.infoLabel}>Ngày tạo: </Text>
              <Text style={styles.infoValue}>{note.createdAt}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📁</Text>
              <Text style={styles.infoLabel}>Danh mục: </Text>
              <View style={styles.tagSmall}><Text style={styles.tagText}>{note.type}</Text></View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>❤️</Text>
              <Text style={styles.infoLabel}>Lượt thích: </Text>
              <Text style={styles.infoValue}>{note.likes}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  logo: { fontSize: 22, fontWeight: 'bold', color: '#3b82f6' },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 12 },
  searchInput: { 
    flex: 1, 
    height: 40, 
    backgroundColor: '#f1f5f9', 
    borderRadius: 8, 
    paddingHorizontal: 12,
    fontSize: 15 
  },
  addButton: { 
    backgroundColor: '#3b82f6', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 8 
  },
  addButtonText: { color: 'white', fontWeight: '600', fontSize: 14 },

  mainContent: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  noteCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: width < 400 ? 16 : 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  titleRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: 16 
  },
  noteTitle: { 
    fontSize: width < 400 ? 22 : 26, 
    fontWeight: 'bold', 
    flex: 1, 
    marginRight: 10 
  },

  actionGroup: { flexDirection: 'row', gap: 8 },
  editBtn: { 
    backgroundColor: '#3b82f6', 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderRadius: 8 
  },
  editText: { color: 'white', fontWeight: '600', fontSize: 14 },
  deleteBtn: { 
    backgroundColor: '#ef4444', 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderRadius: 8 
  },
  deleteText: { color: 'white', fontWeight: '600', fontSize: 14 },

  metaRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 16, 
    marginBottom: 20 
  },
  metaItem: { marginBottom: 8 },
  label: { color: '#64748b', fontSize: 14 },
  value: { fontSize: 16, fontWeight: '500' },
  tag: { 
    backgroundColor: '#e0f2fe', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 999, 
    alignSelf: 'flex-start' 
  },
  tagText: { color: '#0369a1', fontSize: 14 },

  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  noteContent: { 
    fontSize: 16, 
    lineHeight: 26, 
    color: '#334155' 
  },

  infoSection: { 
    marginTop: 24, 
    paddingTop: 20, 
    borderTopWidth: 1, 
    borderTopColor: '#e5e7eb' 
  },
  sidebarTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  infoIcon: { fontSize: 20 },
  infoLabel: { fontSize: 14, color: '#64748b' },
  infoValue: { fontSize: 16, fontWeight: '500' },
  tagSmall: { 
    backgroundColor: '#e0f2fe', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 999 
  },
});