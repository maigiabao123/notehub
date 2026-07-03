// src/app/_layout.tsx
import React, { createContext, useEffect, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
});

export default function RootLayout() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments(); // ví dụ ['login'], ['index'], ['profile']

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = await AsyncStorage.getItem("token"); // bạn đang lưu "token"
      setToken(storedToken);
      setLoading(false);
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (loading) return;

    const first = segments[0]; // tên file đầu trong /src/app
    const inAuth = first === "login" || first === "signup";

    if (!token && !inAuth) {
      // chưa đăng nhập mà không ở trang login/signup → ép về /login
      router.replace("/login");
    }

    if (token && inAuth) {
      // đã có token mà vẫn ở login/signup → chuyển về trang chính
      router.replace("/"); // hoặc "/" nếu bạn muốn
    }
  }, [segments, token, loading, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      <Slot />
    </AuthContext.Provider>
  );
}