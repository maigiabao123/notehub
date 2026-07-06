// src/features/notes/screens/homescreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getHome, Article } from '../../../services/noteService';
import NotesListView from '../components/notelistView/notelistView';

type AppPath =
  | '/'
  | '/add_note'
  | '/my_notes'
  | '/hoc_tap'
  | '/cong_viec'
  | '/ca_nhan'
  | '/khac'
  | '/profile'
  | '/login'
  | '/signup';

type Counts = {
  hoctap: number;
  congviec: number;
  canhan: number;
  khac: number;
};

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getHome();
        console.log('articles sau khi getHome:', data.articles);
        setArticles(data.articles || []);
        // LẤY counts TỪ API /api/home
        setCounts(data.counts || null);
      } catch (e) {
        console.log('LOI /api/home:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = articles.filter((a) =>
    (a.title || '').toLowerCase().includes(search.toLowerCase()),
  );

  const goTo = (path: AppPath) => {
    setSidebarOpen(false);
    router.push(path);
  };

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarOpen(true)} style={styles.menuBtn}>
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

      {/* SEARCH */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Tìm kiếm ghi chú..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* LIST */}
      <NotesListView
        notes={filtered}
        loading={loading}
        onPressItem={(note) =>
          router.push({
            pathname: '/specific_note',
            params: {
              code: note.code.toString(),
            },
          })
        }
      />

      {/* SIDEBAR */}
      <Modal
        visible={sidebarOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSidebarOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setSidebarOpen(false)} />
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.logo}>NoteHub</Text>
            <TouchableOpacity onPress={() => setSidebarOpen(false)}>
              <Text style={{ fontSize: 18 }}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuSection}>
            <TouchableOpacity onPress={() => goTo('/')}>
              <Text style={[styles.menuItem, styles.menuItemActive]}>Trang chủ</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goTo('/my_notes')}>
              <Text style={styles.menuItem}>Ghi chú của tôi</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Danh mục</Text>

          {/* mỗi dòng hiển thị icon + tên + số bài */}
          <TouchableOpacity onPress={() => goTo('/hoc_tap')}>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryItem}>🎓 Học tập</Text>
              <Text style={styles.categoryCount}>{counts?.hoctap ?? 0}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => goTo('/cong_viec')}>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryItem}>💼 Công việc</Text>
              <Text style={styles.categoryCount}>{counts?.congviec ?? 0}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => goTo('/ca_nhan')}>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryItem}>👤 Cá nhân</Text>
              <Text style={styles.categoryCount}>{counts?.canhan ?? 0}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => goTo('/khac')}>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryItem}>⋯   Khác</Text>
              <Text style={styles.categoryCount}>{counts?.khac ?? 0}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.authButtons}>
            <TouchableOpacity
              style={styles.btnOutline}
              onPress={() => goTo('/profile')}
            >
              <Text style={styles.btnOutlineText}>Tài khoản</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnOutline}
              onPress={() => goTo('/login')}
            >
              <Text style={styles.btnOutlineText}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#eef2f7',
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuBtn: {
    width: 28,
    justifyContent: 'space-between',
    marginRight: 8,
    height: 18,
  },
  menuLine: {
    height: 2,
    backgroundColor: '#333',
    borderRadius: 1,
  },
  logo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a73e8',
    flex: 1,
  },
  btnPrimary: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#1a73e8',
    borderRadius: 6,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  searchRow: {
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d0d7e2',
    fontSize: 14,
  },
  listWrapper: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 260,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
    elevation: 4,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  menuSection: {
    marginBottom: 16,
  },
  menuItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  menuItemActive: {
    color: '#1a73e8',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 12,
    color: '#9a9a9a',
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryItem: {
    fontSize: 13,
    color: '#333',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
    marginBottom: 20,
  },
  categoryCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a73e8',
  },
  authButtons: {
    marginTop: 'auto',
  },
  btnOutline: {
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#1a73e8',
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  btnOutlineText: {
    color: '#1a73e8',
    fontWeight: '500',
    fontSize: 13,
  },
});

export default HomeScreen;