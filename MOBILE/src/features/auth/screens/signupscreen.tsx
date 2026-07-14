// src/features/auth/screens/SignupScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
const BASE_URL =
  Platform.OS === "web" ? "http://localhost:5000" : "http://10.0.2.2:5000";

const SignupScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");

  const handleSignup = async () => {
    if (!email || !username || !password || !gender) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin!");
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
      router.replace("/login");
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
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.card}>
            <Text style={styles.brand}>NoteHub</Text>
            <Text style={styles.title}>Đăng ký tài khoản</Text>
            <Text style={styles.subtitle}>
              Điền thông tin để tạo tài khoản mới.
            </Text>

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
                placeholder="Nhập giới tính"
                value={gender}
                onChangeText={setGender}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>Đăng ký</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>hoặc</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.googleButton}>
              <View style={styles.googleDot} />
              <Text style={styles.googleText}>Đăng ký với Google</Text>
            </TouchableOpacity>

            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Đã có tài khoản? </Text>
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
  container: {
    flex: 1,
    backgroundColor: "#f4f6fb",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  } as any,
  brand: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2563eb",
    textAlign: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 13,
    color: "#9ca3af",
  },
  googleButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  googleDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#22c55e",
    marginRight: 8,
  },
  googleText: {
    fontSize: 14,
    color: "#374151",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },
  bottomText: {
    color: "#4b5563",
    fontSize: 14,
  },
  link: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "700",
  },
});