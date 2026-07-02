// src/features/auth/screens/LoginScreen.tsx
import React, { useState } from "react";
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

const BASE_URL = "http://127.0.0.1:5000"; // web; emulator thì 10.0.2.2

const LoginScreen: React.FC = () => {
  const router = useRouter();
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


      router.replace("/");   
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

          <View style={styles.hero}>
            <Text style={styles.heroTitle}>
              Chào mừng bạn trở lại với{" "}
              <Text style={styles.heroHighlight}>NoteHub!</Text>
            </Text>
            <Text style={styles.heroSubtitle}>
              Đăng nhập để tiếp tục ghi chú và quản lý công việc của bạn.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.formTitle}>Đăng nhập</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tên đăng nhập</Text>
              <TextInput
                style={styles.input}
                placeholder="Tên đăng nhập"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mật khẩu</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
              <Text style={styles.primaryText}>Đăng nhập</Text>
            </TouchableOpacity>

            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.push("/signup")}>
                <Text style={styles.bottomLink}>Đăng ký ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
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