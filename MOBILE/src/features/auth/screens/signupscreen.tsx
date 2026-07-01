// src/features/auth/screens/SignupScreen.tsx
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
import { useRouter } from "expo-router";

const BASE_URL = "http://localhost:5000"; // web; emulator thì 10.0.2.2

const SignupScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");

  const handleSignup = async () => {
    if (!email || !username || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/signup`, {
        email,
        username,
        password,
        gender,
      });

      console.log("Signup success:", res.data);

      // CHUYỂN TRỰC TIẾP VỀ LOGIN
      router.replace("/login");

      // Nếu muốn hiển thị Alert:
      // Alert.alert("Thành công", "Tài khoản đã được tạo!", [
      //   { text: "OK", onPress: () => router.replace("/login") },
      // ]);
    } catch (error: any) {
      console.log("Signup error:", error?.response?.data || error.message);
      const msg =
        error?.response?.data?.message ||
        "Đăng ký thất bại. Vui lòng thử lại.";
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
              Chào mừng bạn đến với{" "}
              <Text style={styles.heroHighlight}>NoteHub!</Text>
            </Text>
            <Text style={styles.heroSubtitle}>
              Tạo tài khoản để bắt đầu ghi chú, lưu ý tưởng và quản lý mọi thứ
              của bạn dễ dàng.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.formTitle}>Đăng ký tài khoản</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tên đăng nhập</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập tên đăng nhập"
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Giới tính</Text>
              <TextInput
                style={styles.input}
                placeholder="Nam / Nữ / Khác"
                value={gender}
                onChangeText={setGender}
              />
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleSignup}>
              <Text style={styles.primaryText}>Đăng ký</Text>
            </TouchableOpacity>

            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.bottomLink}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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

export default SignupScreen;