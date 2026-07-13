// src/screens/MyNoteScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Modal,
  Pressable,
} from "react-native";
import axios from "axios";
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// ✅ BASE URL chung cho web + android
const API_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:5000'   // Android
    : 'http://localhost:5000'; // Web 
export interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  code: number;
  created_at: string;
}

type AppPath =
  | '/'
  | '/add_note'
  | '/my_notes'
  | '/hoc_tap'
  | '/cong_viec'
  | '/ca_nhan'
  | '/khac'
  | '/profile'
  | '/login';

const getToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem("token");
    return token;
  } catch (e) {
    console.log("Lỗi lấy token:", e);
    return null;
  }
};

const MyNoteScreen: React.FC = () => {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        console.log("Chưa có token, có thể chưa đăng nhập");
        setNotes([]);
        return;
      }

      const res = await axios.get(`${API_URL}/api/my_note_mobile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const raw = res.data.articles || [];
      const mapped: Note[] = raw.map((a: any) => ({
        id: a.code,
        title: a.title,
        content: a.content,
        category: a.type_article,
        code: a.code,
        created_at: a.time,
      }));

      setNotes(mapped);
    } catch (error: any) {
      console.log("Lỗi load notes:", error.response?.data || error.message);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const goTo = (path: AppPath) => {
    setSidebarOpen(false);
    router.push(path);
  };

  const renderNote = ({ item }: { item: Note }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardContent} numberOfLines={6}>
        {item.content}
      </Text>
      <Text style={styles.cardMeta}>
        Loại: {item.category} | Mã: {item.code} | Lúc: {item.created_at}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER với Hamburger Menu */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarOpen(true)} style={styles.menuBtn}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Ghi chú của tôi</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push("/add_note")}>
          <Text style={styles.addBtnText}>+ Thêm</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách ghi chú */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1976d2" />
        </View>
      ) : notes.length === 0 ? (
        <View style={styles.center}>
          <Text>Chưa có ghi chú</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNote}
          contentContainerStyle={styles.list}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />
      )}

      {/* SIDEBAR - Giống HomeScreen */}
      <Modal
        visible={sidebarOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSidebarOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setSidebarOpen(false)} />
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.logo}>NoteHub</Text>
            <TouchableOpacity onPress={() => setSidebarOpen(false)}>
              <Text style={{ fontSize: 24, fontWeight: 'bold' }}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuSection}>
            <TouchableOpacity onPress={() => goTo('/')}>
              <Text style={styles.menuItem}>Trang chủ</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goTo('/my_notes')}>
              <Text style={[styles.menuItem, styles.menuItemActive]}>Ghi chú của tôi</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Danh mục</Text>

          <TouchableOpacity onPress={() => goTo('/hoc_tap')}>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryItem}>🎓 Học tập</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => goTo('/cong_viec')}>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryItem}>💼 Công việc</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => goTo('/ca_nhan')}>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryItem}>👤 Cá nhân</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => goTo('/khac')}>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryItem}>⋯ Khác</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.authButtons}>
            <TouchableOpacity style={styles.btnOutline} onPress={() => goTo('/profile')}>
              <Text style={styles.btnOutlineText}>Tài khoản</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOutline} onPress={() => goTo('/login')}>
              <Text style={styles.btnOutlineText}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MyNoteScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fb" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    elevation: 2,
  },
  menuBtn: {
    width: 28,
    height: 20,
    justifyContent: 'space-between',
    marginRight: 12,
  },
  menuLine: {
    height: 2.5,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  topTitle: {
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
  },
  addBtn: {
    backgroundColor: "#1976d2",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 6,
  },
  addBtnText: { color: "#ffffff", fontWeight: "600", fontSize: 13 },

  list: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: "48%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  cardContent: { fontSize: 13, color: "#444", marginBottom: 12 },
  cardMeta: { fontSize: 11, color: "#777" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Sidebar styles
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 270,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    elevation: 10,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  logo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a73e8',
  },
  menuSection: {
    marginBottom: 20,
  },
  menuItem: {
    fontSize: 15,
    color: '#555',
    paddingVertical: 10,
  },
  menuItemActive: {
    color: '#1a73e8',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 13,
    color: '#9a9a9a',
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  categoryItem: {
    fontSize: 15,
    color: '#333',
    paddingVertical: 10,
  },
  categoryRow: {
    marginVertical: 4,
  },
  authButtons: {
    marginTop: 'auto',
  },
  btnOutline: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#1a73e8',
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  btnOutlineText: {
    color: '#1a73e8',
    fontWeight: '600',
  },
});