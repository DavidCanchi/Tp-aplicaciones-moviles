// screens/RegisterScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, FONTS, RADIUS } from '../utils/theme';
import { registerUser } from '../utils/storage';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Completá todos los campos.');
      return;
    }
    if (username.trim().length < 3) {
      Alert.alert('Error', 'El usuario debe tener al menos 3 caracteres.');
      return;
    }
    if (password.length < 4) {
      Alert.alert('Error', 'La contraseña debe tener al menos 4 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    const result = await registerUser(username.trim(), password);
    setLoading(false);

    if (result.success) {
      Alert.alert('¡Listo!', 'Cuenta creada. Ahora podés iniciar sesión.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🚀</Text>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Unos datos y ya empezamos</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <InputField
            label="Usuario"
            value={username}
            onChangeText={setUsername}
            placeholder="Elegí un nombre de usuario"
          />
          <InputField
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 4 caracteres"
            secureTextEntry
          />
          <InputField
            label="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repetí tu contraseña"
            secureTextEntry
          />

          <CustomButton
            title="Crear cuenta"
            onPress={handleRegister}
            loading={loading}
            style={{ marginTop: SPACING.sm }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  backBtn: {
    marginBottom: SPACING.lg,
    marginTop: SPACING.md,
  },
  backText: {
    color: COLORS.primary,
    fontSize: 16,
    ...FONTS.medium,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  emoji: {
    fontSize: 56,
    marginBottom: SPACING.sm,
  },
  title: {
    color: COLORS.text,
    fontSize: 32,
    ...FONTS.heavy,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});

export default RegisterScreen;
