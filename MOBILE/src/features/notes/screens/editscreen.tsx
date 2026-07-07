// features/notes/EditScreen.tsx
import React, { useState } from 'react';
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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { height } = Dimensions.get('window');

export default function EditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Nhận dữ liệu note từ params
  const article = params.article 
    ? JSON.parse(typeof params.article === 'string' ? params.article : '{}') 
    : {};

  const [title, setTitle] = useState(article.title || '');
  const [content, setContent] = useState(article.content || '');
  const [typeArticle, setTypeArticle] = useState(article.type_article || 'hoctap');

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tiêu đề ghi chú!');
      return;
    }

    // TODO: Gọi API hoặc Redux để lưu
    console.log('Lưu ghi chú:', { title, content, typeArticle, code: article.code });

    Alert.alert('Thành công', 'Ghi chú đã được cập nhật!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Icon name="arrow-left" size={22} color="#374151" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Chỉnh sửa ghi chú</Text>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Icon name="save" size={20} color="#fff" />
            <Text style={styles.saveText}>Lưu</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainContent}>
            {/* Tiêu đề */}
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

            {/* Loại */}
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

            {/* Nội dung */}
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
                placeholder="Viết nội dung ghi chú của bạn..."
                multiline
                textAlignVertical="top"
                maxLength={5000}
              />

              <Text style={styles.counter}>{content.length} / 5000</Text>
            </View>

            {/* Thông tin */}
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Thông tin ghi chú</Text>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Ngày tạo / sửa gần nhất</Text>
                <Text style={styles.infoValue}>{article.time || 'Hôm nay'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Danh mục</Text>
                <Text style={styles.typeBadge}>
                  {typeArticle === 'hoctap' ? 'Học tập' :
                   typeArticle === 'congviec' ? 'Công việc' :
                   typeArticle === 'canhan' ? 'Cá nhân' : 'Khác'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Trạng thái</Text>
                <Text style={styles.statusBadge}>Đã lưu</Text>
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
  scrollContent: { paddingHorizontal: 16, paddingBottom: 120 },

  mainContent: { 
    maxWidth: 700, 
    alignSelf: 'center', 
    width: '100%' 
  },

  section: { marginBottom: 28 },
  label: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#374151', 
    marginBottom: 8,
    paddingLeft: 4 
  },

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

  counter: { 
    textAlign: 'right', 
    color: '#9ca3af', 
    marginTop: 6, 
    fontSize: 14 
  },

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
  typeBadge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 14,
    fontWeight: '600',
  },
});