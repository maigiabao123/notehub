// LoginScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";

const BASE_URL = "http://10.0.2.2:5000"; // đổi theo IP backend

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/login`, {
        username,
        password,
      });

      const user = res.data.user;
      // TODO: lưu user.user_id vào AsyncStorage / context để dùng gọi API ghi chú
      // await AsyncStorage.setItem("user_id", String(user.user_id));

      Alert.alert("Thành công", "Đăng nhập thành công!", [
        {
          text: "OK",
          onPress: () => router.replace("/"), // /home = MyNoteScreen
        },
      ]);
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
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>Đăng nhập</Text>

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
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </TouchableOpacity>

            <View style={styles.row}>
              <Text style={styles.text}>Chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.push("/signup")}>
                <Text style={styles.link}>Đăng ký ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  keyboardAvoid: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20 },
  content: { paddingVertical: 30 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
  inputGroup: { marginBottom: 16 },
  label: { marginBottom: 4, fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  loginButton: {
    backgroundColor: "#1976d2",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  loginButtonText: { color: "#fff", fontWeight: "600" },
  row: { flexDirection: "row", marginTop: 16 },
  text: { color: "#495057" },
  link: { color: "#1976d2", fontWeight: "600" },
});