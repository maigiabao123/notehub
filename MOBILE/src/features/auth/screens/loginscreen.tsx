// src/features/auth/screens/LoginScreen.tsx
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { AuthContext } from "../../../app/_layout"; // chỉnh đường dẫn nếu khác

const BASE_URL = "http://127.0.0.1:5000"; // backend Python của bạn

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { setToken } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập tên đăng nhập và mật khẩu");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/login`, {
        username,
        password,
      });

      const { token, user } = res.data;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setToken(token); // cập nhật context

      router.replace("/"); // hoặc "/", tuỳ file home của bạn
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";
      Alert.alert("Lỗi", msg);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.logo}>NoteHub</Text>
          {/* ... UI còn lại giữ nguyên ... */}
          <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
            <Text style={styles.primaryText}>Đăng nhập</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


// phần styles giữ như bạn đã có
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scroll: { padding: 16 },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  hero: { marginBottom: 16 },
  heroTitle: { fontSize: 20, fontWeight: "bold" },
  heroHighlight: { color: "#ff5a5f" },
  heroSubtitle: { marginTop: 4, color: "#666" },
  card: { backgroundColor: "#fff", borderRadius: 8, padding: 16 },
  formTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  inputGroup: { marginBottom: 12 },
  label: { marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  primaryBtn: {
    marginTop: 8,
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontWeight: "bold" },
  bottomRow: { flexDirection: "row", marginTop: 12, justifyContent: "center" },
  bottomText: { color: "#555" },
  bottomLink: { color: "#007AFF", fontWeight: "bold" },
});

export default LoginScreen;