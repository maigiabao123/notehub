// app/features/notes/screens/[code].tsx
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../../../app/_layout';

const { width } = Dimensions.get('window');

// ✅ BASE URL chung cho web + android
const API_BASE =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:5000'   // Android
    : 'http://localhost:5000'; // Web

interface Article {
  code: number;
  title: string;
  content: string;
  time: string;
  type_article: string;
  luot_thich: number;
  user_id: number;
}

interface DecodedToken {
  user_id: number;
}

export default function NoteDetail() {
  const { token } = useContext(AuthContext);
  const { code } = useLocalSearchParams<{ code: string }>();
  const router = useRouter();

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Decode token
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        console.log('✅ User ID from Context:', decoded.user_id);
        setCurrentUserId(decoded.user_id);
      } catch (err: any) {
        console.error('❌ JWT Decode Error:', err.message);
      }
    } else {
      console.warn('⚠️ Token is null in AuthContext');
    }
  }, [token]);

  // Fetch bài viết
  useEffect(() => {
    if (!code) {
      setError('Không có mã bài viết');
      setLoading(false);
      return;
    }

    const fetchArticle = async () => {
      try {
        const url = `${API_BASE}/api/article/code/${code}`;
        console.log('FETCH DETAIL URL =', url);

        const response = await fetch(url, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Không tìm thấy bài viết');

        const data: Article = await response.json();
        console.log('📄 Fetched article user_id:', data.user_id);
        setArticle(data);
      } catch (err: any) {
        setError(err.message || 'Lỗi khi tải bài viết');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [code]);

  // Kiểm tra quyền sở hữu
  const isOwner =
    currentUserId !== null &&
    article?.user_id !== undefined &&
    currentUserId === Number(article.user_id);

  const handleDelete = () => {
    console.log("=== handleDelete ĐANG CHẠY ===");
    console.log("Article code:", article?.code);
    console.log("CurrentUserId:", currentUserId);

    const isConfirmed = window.confirm("Bạn có chắc muốn xóa ghi chú này?");

    if (isConfirmed) {
      console.log("✅ Người dùng ĐÃ XÁC NHẬN xóa");
      deleteNoteAPI();
    } else {
      console.log("Người dùng hủy");
    }
  };

  const deleteNoteAPI = async () => {
    if (!article || !currentUserId) {
      alert("Thiếu thông tin bài viết hoặc user");
      return;
    }

    const url = `${API_BASE}/api/mobile/articles/${article.code}?user_id=${currentUserId}`;
    console.log("📡 Đang gọi API xóa:", url);

    try {
      const response = await fetch(url, { method: "DELETE" });

      console.log("Status:", response.status);

      const data = await response.json().catch(() => ({}));
      console.log("Response:", data);

      if (response.ok) {
        alert("✅ Đã xóa thành công!");
        router.replace("/");
      } else {
        alert("❌ Lỗi: " + (data.message || response.status));
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không kết nối được server");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={{ marginTop: 12, color: '#64748b' }}>Đang tải ghi chú...</Text>
        </View>
      </View>
    );
  }

  if (error || !article) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, color: '#ef4444', textAlign: 'center' }}>
            {error || 'Không tìm thấy ghi chú'}
          </Text>
          <Text style={{ marginTop: 10 }}>Mã: {code}</Text>
          <TouchableOpacity onPress={() => router.push('/')} style={{ marginTop: 20 }}>
            <Text style={{ color: '#3b82f6' }}>Quay lại trang chủ</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.mainContent} contentContainerStyle={styles.scrollContent}>
        <View style={styles.noteCard}>
          <View style={styles.titleRow}>
            <Text style={styles.noteTitle}>{article.title}</Text>

            {/* Nút Sửa & Xóa */}
            {isOwner && (
              <View style={styles.actionGroup}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => {
                    console.log('Go edit with code =', code);
                    router.push({
                      pathname: '/edit_note',
                      params: { code },
                    });
                  }}
                >
                  <Text style={styles.editText}>Sửa</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => {
                    console.log("🔴 NÚT XÓA ĐÃ ĐƯỢC NHẤN!");   // ← Thêm dòng này
                    handleDelete();
                  }}
                >
                  <Text style={styles.deleteText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* phần dưới giữ nguyên như cũ */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.label}>Loại</Text>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{article.type_article}</Text>
              </View>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.label}>Mã</Text>
              <Text style={styles.value}>{article.code}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.label}>Ngày</Text>
              <Text style={styles.value}>{article.time}</Text>
            </View>
          </View>

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Nội dung</Text>
          <Text style={styles.noteContent}>{article.content}</Text>

          <View style={styles.infoSection}>
            <Text style={styles.sidebarTitle}>THÔNG TIN GHI CHÚ</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📅</Text>
              <Text style={styles.infoLabel}>Ngày tạo: </Text>
              <Text style={styles.infoValue}>{article.time}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📁</Text>
              <Text style={styles.infoLabel}>Danh mục: </Text>
              <View style={styles.tagSmall}>
                <Text style={styles.tagText}>{article.type_article}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>❤️</Text>
              <Text style={styles.infoLabel}>Lượt thích: </Text>
              <Text style={styles.infoValue}>{article.luot_thich}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// styles giữ nguyên như file bạn gửi
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
    fontSize: 15,
  },
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
    marginBottom: 16,
  },
  noteTitle: {
    fontSize: width < 400 ? 22 : 26,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  actionGroup: { flexDirection: 'row', gap: 8 },
  editBtn: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editText: { color: 'white', fontWeight: '600', fontSize: 14 },
  deleteBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteText: { color: 'white', fontWeight: '600', fontSize: 14 },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  metaItem: { marginBottom: 8 },
  label: { color: '#64748b', fontSize: 14 },
  value: { fontSize: 16, fontWeight: '500' },
  tag: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  tagText: { color: '#0369a1', fontSize: 14 },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  noteContent: {
    fontSize: 16,
    lineHeight: 26,
    color: '#334155',
  },
  infoSection: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
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
    borderRadius: 999,
  },
});