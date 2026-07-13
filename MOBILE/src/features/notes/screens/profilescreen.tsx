// src/features/notes/screens/profilescreen.tsx
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AuthContext } from "../../../app/_layout";
import { Platform } from 'react-native';
// ✅ BASE URL chung cho web + android
const BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:5000'   // Android
    : 'http://localhost:5000'; // Web

type User = {
  user_id: number;
  username: string;
  email: string;
  gender?: string;
};

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { setToken } = useContext(AuthContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Lấy thông tin user (ưu tiên từ AsyncStorage, nếu chưa có thì gọi API)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          const token = await AsyncStorage.getItem("token");

          if (token) {
            const res = await axios.get(`${BASE_URL}/api/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            setUser(res.data);
            await AsyncStorage.setItem("user", JSON.stringify(res.data));
          } else {
            // Không có token ⇒ không thể lấy user
            setUser(null);
          }
        }
      } catch (err) {
        console.log("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ĐĂNG XUẤT
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      setToken(null);
      router.replace("/login");
    } catch (err) {
      console.log("Error logging out:", err);
    }
  };

  // Đang load dữ liệu
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Load xong nhưng không có user ⇒ không quay nữa, hiển thị thông báo/redirect
  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.</Text>
        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={{ color: "blue", marginTop: 8 }}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Có user ⇒ hiển thị hồ sơ
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.brand}>NoteHub</Text>
        </TouchableOpacity>

        {/* DROPDOWN TÀI KHOẢN */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.accountBtn}
            onPress={() => setAccountMenuOpen((prev) => !prev)}
          >
            <Text style={styles.accountBtnText}>{user.username} ▾</Text>
          </TouchableOpacity>

          {accountMenuOpen && (
            <View style={styles.accountMenu}>
              <TouchableOpacity
                style={styles.accountMenuItem}
                onPress={handleLogout}
              >
                <Text style={styles.accountMenuText}>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>



      {/* NỘI DUNG HỒ SƠ + TÓM TẮT TÀI KHOẢN */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HỒ SƠ NGƯỜI DÙNG */}
        <View style={styles.profileCard}>
          <Text style={styles.cardTitle}>Hồ sơ người dùng</Text>

          {/* hàng 1: mã người dùng */}
          <Text style={styles.label}>Mã người dùng</Text>
          <View style={styles.input}>
            <Text>{user.user_id}</Text>
          </View>

          {/* hàng 2: tên đăng nhập + giới tính */}
          <View style={styles.inlineRow}>
            <View style={styles.inlineItem}>
              <Text style={styles.label}>Tên đăng nhập</Text>
              <View style={styles.input}>
                <Text>{user.username}</Text>
              </View>
            </View>

            <View style={styles.inlineItem}>
              <Text style={styles.label}>Giới tính</Text>
              <View style={styles.input}>
                <Text>{user.gender || "Chưa cập nhật"}</Text>
              </View>
            </View>
          </View>

          {/* hàng 3: email */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.input}>
            <Text>{user.email}</Text>
          </View>

          {/* hàng 4: mật khẩu (che) */}
          <Text style={styles.label}>Mật khẩu</Text>
          <View style={styles.input}>
            <Text>********</Text>
          </View>
        </View>

        {/* TÓM TẮT TÀI KHOẢN */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Tóm tắt tài khoản</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tên đăng nhập</Text>
            <Text style={styles.summaryValue}>{user.username}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Email</Text>
            <Text style={styles.summaryValue}>{user.email}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Giới tính</Text>
            <Text style={styles.summaryValue}>
              {user.gender || "Chưa cập nhật"}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal demo (nếu cần) */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text>Modal demo</Text>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 2,
    zIndex: 999,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  menuIcon: { fontSize: 20, marginRight: 8 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },

  headerRight: { position: "relative", zIndex: 1000 },
  accountBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#eee",
    borderRadius: 20,
  },
  accountBtnText: { fontWeight: "500" },
  accountMenu: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 4,
    elevation: 4,
    zIndex: 1000,
  },
  accountMenuItem: { paddingHorizontal: 12, paddingVertical: 8, width: 100 },
  accountMenuText: { color: "#e53935", fontWeight: "500" },

  sidebar: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  menuTitle: { fontSize: 12, color: "#6b7280", marginTop: 4, marginBottom: 8 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuItemActive: {
    backgroundColor: "#e0ebff",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  menuLabel: { fontSize: 14, color: "#4b5563" },
  menuLabelActive: { fontSize: 14, color: "#1d4ed8", fontWeight: "600" },

  scroll: { flex: 1 },
  scrollContent: { padding: 16 },

  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  summaryCard: {
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },

  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  label: { marginTop: 8, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  inlineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  inlineItem: { flex: 1, marginRight: 8 },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: { color: "#555" },
  summaryValue: { fontWeight: "500" },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    minWidth: 200,
  },
  brand: {
    fontSize: 18, color: "rgba(26, 115, 232, 1.00)", fontWeight: "800"
  }
});

export default ProfileScreen;