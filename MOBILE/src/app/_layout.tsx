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
  setToken: () => { },
});

export default function RootLayout() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments(); // ví dụ ['login'], ['index'], ['profile']

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        setToken(storedToken);
      } catch (e) {
        console.log('initAuth error', e);
        // tuỳ bạn xử lý
      } finally {
        setLoading(false);  // đảm bảo luôn chạy
      }
    };
    initAuth();
  }, []);
  useEffect(() => {
    if (loading) return;

    const first = segments[0];
    const inAuth = first === "login" || first === "signup";

    // CHỈ redirect khi ĐÃ login mà vẫn ở login/signup
    if (token && inAuth) {
      router.replace("/"); // index.tsx là trang chủ của bạn
    }

    // KHÔNG ép người chưa đăng nhập về /login nữa
  }, [segments, token, loading, router]);

  console.log('RootLayout loading:', loading, 'token:', token);
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