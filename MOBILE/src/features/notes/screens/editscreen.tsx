import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { height } = Dimensions.get('window');

// ✅ BASE URL giống file [code].tsx
const API_BASE =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:5000'
    : 'http://localhost:5000';

export default function EditScreen() {
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code: string }>();

  const [article, setArticle] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [typeArticle, setTypeArticle] = useState('hoctap');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Lấy dữ liệu khi vào màn hình
  useEffect(() => {
    console.log('Edit screen code =', code);
    if (code) {
      fetchNote(code as string);
    } else {
      Alert.alert('Lỗi', 'Không tìm thấy mã ghi chú');
      router.back();
    }
  }, [code]);

  const fetchNote = async (noteCode: string) => {
    try {
      setLoading(true);
      const url = `${API_BASE}/api/notes/${noteCode}/edit`;
      console.log('FETCH EDIT URL =', url);

      const response = await fetch(url, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Không tìm thấy ghi chú');
      }

      const data = await response.json();
      setArticle(data);
      setTitle(data.title || '');
      setContent(data.content || '');
      setTypeArticle(data.type_article || 'hoctap');
    } catch (error: any) {
      console.error('FETCH EDIT ERROR =', error?.message ?? error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu ghi chú');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tiêu đề ghi chú!');
      return;
    }
    if (!code) {
      Alert.alert('Lỗi', 'Không có mã ghi chú để lưu');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('type_article', typeArticle);

      const url = `${API_BASE}/api/notes/${code}/edit`;
      console.log('SAVE EDIT URL =', url);

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Thành công', 'Ghi chú đã được cập nhật!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('Lỗi', 'Không thể lưu ghi chú');
      }
    } catch (error: any) {
      console.error('SAVE EDIT ERROR =', error?.message ?? error);
      Alert.alert('Lỗi', 'Không thể kết nối với server');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 12 }}>Đang tải ghi chú...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Icon name="arrow-left" size={22} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chỉnh sửa ghi chú</Text>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
            {saving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Icon name="save" size={20} color="#fff" />
                <Text style={styles.saveText}>Lưu</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.mainContent}>
            <View style={styles.section}>
              <Text style={styles.label}>Tiêu đề</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Nhập tiêu đề ghi chú..."
                maxLength={200}
              />
              <Text style={styles.counter}>{title.length} / 200</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Loại ghi chú</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={typeArticle}
                  onValueChange={setTypeArticle}
                  style={styles.picker}
                >
                  <Picker.Item label="🎓 Học tập" value="hoctap" />
                  <Picker.Item label="💼 Công việc" value="congviec" />
                  <Picker.Item label="👤 Cá nhân" value="canhan" />
                  <Picker.Item label="⋯ Khác" value="khac" />
                </Picker>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Nội dung</Text>
              <View style={styles.toolbar}>
                {['bold', 'italic', 'underline', 'list-ul', 'link'].map((name, index) => (
                  <TouchableOpacity key={index} style={styles.toolBtn}>
                    <Icon name={name} size={20} color="#4b5563" />
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.textArea}
                value={content}
                onChangeText={setContent}
                placeholder="Viết nội dung ghi chú..."
                multiline
                textAlignVertical="top"
                maxLength={5000}
              />
              <Text style={styles.counter}>{content.length} / 5000</Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Thông tin ghi chú</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Ngày tạo / sửa</Text>
                <Text style={styles.infoValue}>{article?.time || 'Hôm nay'}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  keyboardAvoid: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    gap: 6,
  },
  saveText: { color: 'white', fontWeight: '600' },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },
  mainContent: { maxWidth: 700, alignSelf: 'center', width: '100%' },
  section: { marginBottom: 28 },
  label: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 16,
    padding: 16,
    fontSize: 17,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 16,
    overflow: 'hidden',
  },
  picker: { height: Platform.OS === 'ios' ? 60 : 55 },
  toolbar: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    gap: 12,
  },
  toolBtn: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  textArea: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 16,
    fontSize: 17,
    lineHeight: 26,
    minHeight: height * 0.38,
  },
  counter: { textAlign: 'right', color: '#9ca3af', marginTop: 6, fontSize: 14 },
  infoCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoTitle: { fontSize: 17, fontWeight: '700', marginBottom: 16 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: { color: '#6b7280' },
  infoValue: { fontWeight: '500' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});