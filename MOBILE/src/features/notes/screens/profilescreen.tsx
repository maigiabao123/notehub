import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const ProfileScreen = () => {
  return (
    <View style={styles.root}>
      {/* SIDEBAR */}
      <View style={styles.sidebar}>
        <View style={styles.logoRow}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>N</Text>
          </View>
          <Text style={styles.logoTitle}>NoteHub</Text>
        </View>

        <Text style={styles.menuTitle}>MENU</Text>

        <TouchableOpacity style={[styles.menuItem, styles.menuItemActive]}>
          <Text style={styles.menuIcon}>🏠</Text>
          <Text style={styles.menuLabelActive}>Trang chủ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>📝</Text>
          <Text style={styles.menuLabel}>Ghi chú của tôi</Text>
        </TouchableOpacity>
      </View>

      {/* MAIN AREA */}
      <View style={styles.mainArea}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <View style={styles.searchBox}>
            <Text style={styles.searchPlaceholder}>Tìm kiếm ghi chú...</Text>
          </View>

          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>+ Thêm ghi chú</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountBtn}>
            <Text style={styles.accountBtnText}>Tài khoản ▾</Text>
          </TouchableOpacity>
        </View>

        {/* CONTENT */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentColumn}>
            {/* USER PROFILE FORM */}
            <View style={styles.profileCard}>
              <Text style={styles.cardTitle}>Hồ sơ người dùng</Text>

              <Text style={styles.label}>Mã người dùng</Text>
              <TextInput style={styles.input} value="2" editable={false} />

              <View style={styles.inlineRow}>
                <View style={styles.inlineItem}>
                  <Text style={styles.label}>Tên đăng nhập</Text>
                  <TextInput style={styles.input} value="GIA_BAO_2208" />
                </View>

                <View style={styles.inlineItem}>
                  <Text style={styles.label}>Giới tính</Text>
                  <TextInput style={styles.input} value="Nam" />
                </View>
              </View>

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value="giabaomai72@gmail.com"
              />

              <Text style={styles.label}>Mật khẩu</Text>
              <TextInput
                style={styles.input}
                value="********"
                secureTextEntry
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.secondaryBtn}>
                  <Text style={styles.secondaryBtnText}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveBtn}>
                  <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ACCOUNT SUMMARY */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Tóm tắt tài khoản</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tên đăng nhập</Text>
                <Text style={styles.summaryValue}>GIA_BAO_2208</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Email</Text>
                <Text style={styles.summaryValue}>
                  giabaomai72@gmail.com
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Giới tính</Text>
                <Text style={styles.summaryValue}>Nam</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  // Layout tổng: LUÔN dọc
  root: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f5f7fb',
  },

  /* SIDEBAR */
  sidebar: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4ec',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  menuTitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 4,
  },
  menuItemActive: {
    backgroundColor: '#eef2ff',
  },
  menuIcon: {
    marginRight: 8,
  },
  menuLabel: {
    color: '#4b5563',
  },
  menuLabelActive: {
    color: '#2563eb',
    fontWeight: '600',
  },

  /* MAIN */
  mainArea: {
    flex: 1,
    width: '100%',
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBox: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginRight: 8,
  },
  searchPlaceholder: {
    color: '#9ca3af',
    fontSize: 13,
  },
  primaryBtn: {
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  accountBtn: {
    paddingHorizontal: 10,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountBtnText: {
    color: '#111827',
    fontSize: 13,
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  // Hai card xếp dọc
  contentColumn: {
    flexDirection: 'column',
    gap: 16,
    marginTop: 16,
  },

  profileCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
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
  },
  inlineRow: {
    flexDirection: 'row',
    gap: 8,
  },
  inlineItem: {
    flex: 1,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  secondaryBtn: {
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: '#4b5563',
    fontSize: 13,
  },
  saveBtn: {
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },

  summaryTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111827',
  },
  summaryRow: {
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
  },
});