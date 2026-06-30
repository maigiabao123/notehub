import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import AppButton from '../../../../components/appButton/appButton';

type Props = {
  loading?: boolean;
  onSubmit: (email: string, password: string) => void;
};

const LoginForm: React.FC<Props> = ({ loading, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handlePress() {
    onSubmit(email, password);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập NoteHub</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <AppButton
        title={loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        onPress={handlePress}
        disabled={loading}
      />
    </View>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
});