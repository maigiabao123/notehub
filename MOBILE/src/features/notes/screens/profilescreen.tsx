// features/notes/screens/profilescreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';

// >>> THÊM
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

type User = {
  user_id: number;
  username: string;
  email: string;
  gender?: string;
};
// <<< HẾT PHẦN THÊM

const ProfileScreen = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // >>> THÊM STATE & USEEFFECT
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await axios.get(`${BASE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);
  // <<< HẾT PHẦN THÊM

  if (loading) {
    return (
      <View style={styles.root}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.root}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Chưa đăng nhập</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* nút 3 gạch */}
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => setSidebarOpen(true)}
        >
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </TouchableOpacity>
        <Text style={styles.logo}>NoteHub</Text>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => router.push('/add_note')}
        >
          <Text style={styles.btnPrimaryText}>+ Thêm ghi chú</Text>
        </TouchableOpacity>
      </View>

      {/* MAIN CONTENT – 1 cột */}
      <View style={styles.main}>
        {/* thanh trên cùng */}
        <View style={styles.topBar}>
          <View style={styles.searchBox}>
            <Text style={styles.searchPlaceholder}>Tìm kiếm ghi chú...</Text>
          </View>
          <TouchableOpacity style={styles.accountBtn}>
            <Text style={styles.accountBtnText}>Tài khoản ▾</Text>
          </TouchableOpacity>
        </View>

        {/* form hồ sơ + tóm tắt tài khoản nằm trong cùng 1 ScrollView */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* FORM HỒ SƠ */}
          <View style={styles.profileCard}>
            <Text style={styles.cardTitle}>Hồ sơ người dùng</Text>

            {/* hàng 1 */}
            <Text style={styles.label}>Mã người dùng</Text>
            <View style={styles.input}>
              <Text>{user.user_id}</Text>
            </View>

            {/* hàng 2 */}
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
                  <Text>{user.gender || 'Chưa cập nhật'}</Text>
                </View>
              </View>
            </View>

            {/* hàng 3 */}
            <Text style={styles.label}>Email</Text>
            <View style={styles.input}>
              <Text>{user.email}</Text>
            </View>

            {/* hàng 4 */}
            <Text style={styles.label}>Mật khẩu</Text>
            <View style={styles.input}>
              <Text>********</Text>
            </View>

            {/* nút */}
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.btnGhost}>
                <Text style={styles.btnGhostText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSave}>
                <Text style={styles.btnSaveText}>Lưu thay đổi</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* TÓM TẮT TÀI KHOẢN – vẫn trong 1 cột, nằm dưới form */}
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
                {user.gender || 'Chưa cập nhật'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* SIDEBAR – trượt vào / ra bằng Modal */}
      <Modal
        visible={sidebarOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSidebarOpen(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setSidebarOpen(false)}
        />
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.logo}>NoteHub</Text>
            <TouchableOpacity onPress={() => setSidebarOpen(false)}>
              <Text style={{ fontSize: 18 }}>×</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.menuTitle}>MENU</Text>
          {/* Trang chủ */}
          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemActive]}
            onPress={() => {
              setSidebarOpen(false);
              router.push('/');
            }}
          >
            <Text style={styles.menuIcon}>🏠</Text>
            <Text style={styles.menuLabelActive}>Trang chủ</Text>
          </TouchableOpacity>

          {/* Ghi chú của tôi */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setSidebarOpen(false);
              router.push('/my_notes');
            }}
          >
            <Text style={styles.menuIcon}>📝</Text>
            <Text style={styles.menuLabel}>Ghi chú của tôi</Text>
          </TouchableOpacity>

          {/* DANH MỤC */}
          <Text style={styles.menuTitle}>DANH MỤC</Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setSidebarOpen(false);
              router.push('/hoc_tap');
            }}
          >
            <Text style={styles.menuIcon}>🎓</Text>
            <Text style={styles.menuLabel}>Học tập</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setSidebarOpen(false);
              router.push('/cong_viec');
            }}
          >
            <Text style={styles.menuIcon}>💼</Text>
            <Text style={styles.menuLabel}>Công việc</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setSidebarOpen(false);
              router.push('/ca_nhan');
            }}
          >
            <Text style={styles.menuIcon}>👤</Text>
            <Text style={styles.menuLabel}>Cá nhân</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setSidebarOpen(false);
              router.push('/khac');
            }}
          >
            <Text style={styles.menuIcon}>⋯</Text>
            <Text style={styles.menuLabel}>Khác</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f5f7fb' },
  /* HEADER */
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    elevation: 2,
  },
  logo: { fontSize: 20, fontWeight: '700', color: '#1d2553' },
  btnPrimary: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnPrimaryText: { color: '#fff', fontWeight: '600' },
  /* nút 3 gạch */
  menuBtn: { padding: 8, justifyContent: 'center' },
  menuLine: {
    width: 20,
    height: 2,
    backgroundColor: '#1d2553',
    marginVertical: 1.5,
    borderRadius: 2,
  },
  main: { flex: 1 },
  /* top bar */
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  searchBox: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  searchPlaceholder: { color: '#9ca3af', fontSize: 14 },
  accountBtn: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  accountBtnText: { fontSize: 14, color: '#374151' },
  /* scroll 1 cột */
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111827',
  },
  label: {
    fontSize: 13,
    color: '#4b5563',
    marginTop: 6,
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 10,
    fontSize: 13,
    justifyContent: 'center',
  },
  inlineRow: {
    flexDirection: 'row',
    gap: 8,
  },
  inlineItem: { flex: 1 },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  btnGhost: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  btnGhostText: { color: '#374151' },
  btnSave: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#2563eb',
  },
  btnSaveText: { color: '#fff', fontWeight: '600' },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: { color: '#6b7280', fontSize: 13 },
  summaryValue: { color: '#111827', fontSize: 13, fontWeight: '500' },
  /* sidebar */
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 260,
    backgroundColor: '#fff',
    padding: 16,
    elevation: 4,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  menuTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 12,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuItemActive: {
    backgroundColor: '#e0ebff',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  menuIcon: { marginRight: 8, fontSize: 16 },
  menuLabel: { fontSize: 14, color: '#4b5563' },
  menuLabelActive: { fontSize: 14, color: '#1d4ed8', fontWeight: '600' },
});

export default ProfileScreen;