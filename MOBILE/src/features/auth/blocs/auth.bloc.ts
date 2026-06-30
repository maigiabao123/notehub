import { useState } from 'react';

type User = {
  email: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);   // <- THÊM DÒNG NÀY

  async function login(email: string, password: string) {
    setLoading(true);          // giờ không còn lỗi
    // ... gọi API hoặc fake
    setUser({ email });
    setLoading(false);
  }

  return { user, loading, login };
}