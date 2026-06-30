// SignupScreen.tsx
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

const BASE_URL = "http://10.0.2.2:5000"; // đổi theo IP backend

const SignupScreen: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");

  const handleSignup = async () => {
    if (!email || !username || !password) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/signup`, {
        email,
        username,
        password,
        gender,
      });

      Alert.alert("Thành công", "Tài khoản đã được tạo!", [
        { text: "OK", onPress: () => router.replace("/login") },
      ]);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        "Đăng ký thất bại. Vui lòng thử lại.";
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
            <Text style={styles.title}>Đăng ký</Text>

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

            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
              <Text style={styles.signupButtonText}>Đăng ký</Text>
            </TouchableOpacity>

            <View style={styles.row}>
              <Text style={styles.text}>Đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.link}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;

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
  signupButton: {
    backgroundColor: "#1976d2",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  signupButtonText: { color: "#fff", fontWeight: "600" },
  row: { flexDirection: "row", marginTop: 16 },
  text: { color: "#495057" },
  link: { color: "#1976d2", fontWeight: "600" },
});