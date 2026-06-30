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

// ĐỔI cho đúng IP server Flask
const BASE_URL = "http://10.0.2.2:5000"; // Android emulator
// iOS simulator: "http://localhost:5000"
// Thiết bị thật: "http://<IP-máy-tính>:5000"

// Kiểu note giống JSON Flask trả ra
export interface Note {
  id: number;
  title: string;
  content: string;
  category: string;   // ví dụ: "congviec", "khac"
  code: number;       // mã
  created_at: string; // "2026-06-09"
}

const MyNoteScreen: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Note[]>(`${BASE_URL}/notes`);
      setNotes(res.data);
    } catch (error: any) {
      console.log("Lỗi load notes:", error.message);
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
        <TouchableOpacity style={styles.addBtn}>
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
});