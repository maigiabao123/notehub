import React, { useState } from 'react';
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
  Modal,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';

const noteTypes = [
  { id: '1', label: 'Học tập', icon: '🎓' },
  { id: '2', label: 'Công việc', icon: '💼' },
  { id: '3', label: 'Cá nhân', icon: '👤' },
  { id: '4', label: 'Khác', icon: '⋯' },
];

const AddScreen: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState(noteTypes[0]);
  const [showTypeModal, setShowTypeModal] = useState(false);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert('Vui lòng nhập tiêu đề và nội dung!');
      return;
    }
    console.log({
      title,
      content,
      type: selectedType.label,
    });
    router.back();
  };

  const selectType = (type: typeof selectedType) => {
    setSelectedType(type);
    setShowTypeModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.headerTitle}>Thêm ghi chú mới</Text>
            <Text style={styles.headerSubtitle}>
              Ghi lại ý tưởng, công việc hoặc bất cứ điều gì bạn muốn lưu lại.
            </Text>

            <View style={styles.form}>
              {/* Tiêu đề */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Tiêu đề <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.titleInput}
                  placeholder="Nhập tiêu đề ghi chú..."
                  value={title}
                  onChangeText={setTitle}
                  maxLength={200}
                />
                <Text style={styles.charCount}>{title.length}/200</Text>
              </View>

              {/* Nội dung */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Nội dung <Text style={styles.required}>*</Text>
                </Text>

                <View style={styles.toolbar}>
                  <TouchableOpacity style={styles.toolButton}>
                    <Text style={styles.toolText}>Đoạn văn</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.toolButton}><Text style={styles.toolText}>B</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.toolButton}><Text style={styles.toolText}>I</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.toolButton}><Text style={styles.toolText}>U</Text></TouchableOpacity>
                </View>

                <TextInput
                  style={styles.contentInput}
                  placeholder="Viết nội dung ghi chú của bạn tại đây..."
                  value={content}
                  onChangeText={setContent}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              {/* Chọn loại ghi chú */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Loại ghi chú</Text>
                <TouchableOpacity
                  style={styles.selectBox}
                  onPress={() => setShowTypeModal(true)}
                >
                  <Text style={styles.selectText}>
                    {selectedType.icon} {selectedType.label}
                  </Text>
                  <Text style={styles.arrow}>▼</Text>
                </TouchableOpacity>
              </View>

              {/* Buttons */}
              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Lưu ghi chú</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => router.back()}
                >
                  <Text style={styles.cancelButtonText}>Hủy bỏ</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal chọn loại ghi chú */}
      <Modal
        visible={showTypeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn loại ghi chú</Text>
            
            <FlatList
              data={noteTypes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedType.id === item.id && styles.modalItemSelected,
                  ]}
                  onPress={() => selectType(item)}
                >
                  <Text style={styles.modalItemIcon}>{item.icon}</Text>
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowTypeModal(false)}
            >
              <Text style={styles.modalCloseText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  keyboardAvoid: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20 },
  content: { paddingVertical: 20 },

  headerTitle: { fontSize: 26, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  headerSubtitle: { fontSize: 16, color: '#64748b', textAlign: 'center', marginBottom: 30 },

  form: { width: '100%' },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', color: '#1e2937', marginBottom: 8 },
  required: { color: '#ef4444' },

  titleInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 17,
  },
  charCount: { textAlign: 'right', color: '#94a3b8', fontSize: 13, marginTop: 4 },

  toolbar: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#e2e8f0',
  },
  toolButton: { paddingHorizontal: 12, paddingVertical: 6, marginRight: 6, borderRadius: 6 },
  toolText: { fontSize: 16, fontWeight: '600' },

  contentInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 240,
  },

  selectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
  },
  selectText: { fontSize: 16 },
  arrow: { fontSize: 18, color: '#64748b' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '85%',
    maxHeight: '50%',
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalItemSelected: {
    backgroundColor: '#2563eb',
  },
  modalItemIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  modalItemText: {
    fontSize: 17,
    color: '#1e2937',
  },
  modalCloseButton: {
    marginTop: 12,
    padding: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  modalCloseText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },

  buttonGroup: { flexDirection: 'row', gap: 12, marginTop: 20 },
  saveButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: { color: 'white', fontSize: 17, fontWeight: '600' },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: { color: '#64748b', fontSize: 17, fontWeight: '600' },
});

export default AddScreen;