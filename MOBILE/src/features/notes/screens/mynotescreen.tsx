// src/screens/MyNoteScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import axios from "axios";
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://127.0.0.1:5000"; // hoặc "http://127.0.0.1:5000"

// Kiểu note giống dữ liệu đã map lại
export interface Note {
  id: number;
  title: string;
  content: string;
  category: string;   // ví dụ: "congviec", "khac"
  code: number;       // mã
  created_at: string; // ví dụ: "2026-06-09 10:20:00"
}

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Flask trả về: { articles: [...], counts: {...} }
      const raw = res.data.articles;

      const mapped: Note[] = raw.map((a: any) => ({
        id: a.code,               // dùng code làm id
        title: a.title,
        content: a.content,
        category: a.type_article, // backend dùng type_article
        code: a.code,
        created_at: a.time,       // backend trả field 'time'
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

      {/* Thanh trên */}
      <View style={styles.topBar}>
        <Text style={styles.topTitle}>Ghi chú của tôi</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push("/add_note")}>
          <Text style={styles.addBtnText}>+ Thêm ghi chú</Text>
        </TouchableOpacity>
      </View>

      {/* Nội dung */}
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
    </SafeAreaView>
  );
};

export default MyNoteScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fb" },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    elevation: 2,
  },
  topTitle: { fontSize: 20, fontWeight: "700" },
  addBtn: {
    backgroundColor: "#1976d2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addBtnText: { color: "#ffffff", fontWeight: "600" },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
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
  brand: {
    fontSize: 18, color: "rgba(26, 115, 232, 1.00)", fontWeight: "800"
  }
});