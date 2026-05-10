// screens/AddTaskScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS, SPACING, FONTS, RADIUS } from '../utils/theme';
import { addTask } from '../utils/storage';
import { scheduleTaskReminder } from '../utils/notifications';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';

const PRIORITIES = [
  { key: 'alta', label: '🔴 Alta', color: COLORS.danger },
  { key: 'media', label: '🟡 Media', color: COLORS.warning },
  { key: 'baja', label: '🟢 Baja', color: COLORS.success },
];

const REMINDER_OPTIONS = [
  { label: 'Sin recordatorio', seconds: null },
  { label: 'En 10 segundos (demo)', seconds: 10 },
  { label: 'En 1 minuto', seconds: 60 },
  { label: 'En 1 hora', seconds: 3600 },
];

const AddTaskScreen = ({ route, navigation }) => {
  const { username } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('media');
  const [reminderIndex, setReminderIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'El título es obligatorio.');
      return;
    }

    setLoading(true);

    await addTask(username, {
      title: title.trim(),
      description: description.trim(),
      priority,
    });

    // Schedule notification if selected
    const reminder = REMINDER_OPTIONS[reminderIndex];
    if (reminder.seconds) {
      await scheduleTaskReminder(title.trim(), reminder.seconds);
      Alert.alert(
        '✅ Tarea guardada',
        `Recibirás un recordatorio "${reminder.label.toLowerCase()}".`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else {
      setLoading(false);
      navigation.goBack();
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Nueva Tarea</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.card}>
          <InputField
            label="Título *"
            value={title}
            onChangeText={setTitle}
            placeholder="¿Qué tenés que hacer?"
          />

          <InputField
            label="Descripción (opcional)"
            value={description}
            onChangeText={setDescription}
            placeholder="Detalles adicionales..."
            multiline
          />

          {/* Priority selector */}
          <Text style={styles.sectionLabel}>PRIORIDAD</Text>
          <View style={styles.priorityRow}>
            {PRIORITIES.map((p) => (
              <TouchableOpacity
                key={p.key}
                style={[
                  styles.priorityBtn,
                  { borderColor: p.color },
                  priority === p.key && { backgroundColor: p.color },
                ]}
                onPress={() => setPriority(p.key)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.priorityText,
                    priority === p.key && { color: COLORS.white, ...FONTS.bold },
                  ]}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Reminder selector */}
          <Text style={[styles.sectionLabel, { marginTop: SPACING.md }]}>RECORDATORIO</Text>
          {REMINDER_OPTIONS.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.reminderRow, reminderIndex === idx && styles.reminderRowActive]}
              onPress={() => setReminderIndex(idx)}
              activeOpacity={0.8}
            >
              <View style={[styles.radio, reminderIndex === idx && styles.radioActive]}>
                {reminderIndex === idx && <View style={styles.radioDot} />}
              </View>
              <Text style={[styles.reminderText, reminderIndex === idx && { color: COLORS.text }]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}

          <CustomButton
            title="Guardar tarea"
            onPress={handleSave}
            loading={loading}
            style={{ marginTop: SPACING.lg }}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    marginTop: SPACING.md,
  },
  backText: {
    color: COLORS.primary,
    fontSize: 16,
    ...FONTS.medium,
  },
  title: {
    color: COLORS.text,
    fontSize: 20,
    ...FONTS.bold,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    ...FONTS.medium,
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    alignItems: 'center',
  },
  priorityText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    ...FONTS.medium,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.xs,
  },
  reminderRowActive: {
    backgroundColor: COLORS.primary + '22',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  radioActive: {
    borderColor: COLORS.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  reminderText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});

export default AddTaskScreen;
