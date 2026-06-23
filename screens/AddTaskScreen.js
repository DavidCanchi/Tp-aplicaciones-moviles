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
import useTaskStore from '../store/useTaskStore';
import { scheduleTaskReminder, requestPermissions } from '../utils/notifications';
import { tomarFoto, elegirDeGaleria, obtenerUbicacion, obtenerContactos, crearEventoCalendario } from '../utils/permisos';
import { Image, ActivityIndicator } from 'react-native';
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
  const [imagen, setImagen] = useState(null);
  const [ubicacion, setUbicacion] = useState(null);
  const [contacto, setContacto] = useState(null);
  const [loadingUbic, setLoadingUbic] = useState(false);

  const { agregarTarea } = useTaskStore();

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'El título es obligatorio.');
      return;
    }
    setLoading(true);

    const nueva = await agregarTarea(username, {
      title: title.trim(),
      description: description.trim(),
      priority,
      imagen,
      ubicacion,
      contacto,
    });

    const reminder = REMINDER_OPTIONS[reminderIndex];

    if (reminder.seconds) {
      const granted = await requestPermissions();
      if (!granted) {
        setLoading(false);
        Alert.alert(
          'Permisos requeridos',
          'Necesitás habilitar las notificaciones en la configuración del dispositivo para recibir recordatorios.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
        return;
      }
      const notifId = await scheduleTaskReminder(title.trim(), reminder.seconds);
      setLoading(false);
      navigation.goBack();
      if (notifId) {
        setTimeout(() => {
          Alert.alert('✅ Tarea guardada', `Recordatorio programado para ${reminder.label.toLowerCase()}.`);
        }, 400);
      }
    } else {
      setLoading(false);
      navigation.goBack();
    }

    // Crear evento en calendario si hay ubicación o descripción
    if (ubicacion || description.trim()) {
      try {
        await crearEventoCalendario(title.trim(), new Date().toISOString(), description.trim());
      } catch {}
    }
  };

  const handlePhoto = () => {
    Alert.alert('Foto adjunta', 'Elegí una fuente', [
      { text: 'Cámara', onPress: async () => {
        const uri = await tomarFoto();
        if (uri) setImagen(uri);
      }},
      { text: 'Galería', onPress: async () => {
        const uri = await elegirDeGaleria();
        if (uri) setImagen(uri);
      }},
      { text: 'Cancelar', style: 'cancel' }
    ]);
  };

  const handleUbicacion = async () => {
    setLoadingUbic(true);
    const ub = await obtenerUbicacion();
    setLoadingUbic(false);
    if (ub) setUbicacion(ub);
  };

  const handleContactos = async () => {
    const list = await obtenerContactos();
    if (!list) return;
    const opciones = list.slice(0, 10).map((c, idx) => ({ text: c.name || `Contacto ${idx+1}`, onPress: () => setContacto({ nombre: c.name, phone: c.phoneNumbers?.[0]?.number || null }) }));
    opciones.push({ text: 'Cancelar', style: 'cancel' });
    Alert.alert('Seleccionar responsable', 'Elegí un contacto', opciones);
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

          {/* Foto adjunta */}
          <Text style={styles.sectionLabel}>FOTO ADJUNTA</Text>
          <View style={{ marginBottom: SPACING.sm }}>
            <CustomButton title={imagen ? 'Cambiar foto' : 'Agregar foto'} onPress={handlePhoto} />
            {imagen ? <Image source={{ uri: imagen }} style={{ width: '100%', height: 160, borderRadius: 6, marginTop: SPACING.sm }} /> : null}
          </View>

          {/* Ubicación */}
          <Text style={styles.sectionLabel}>UBICACIÓN</Text>
          <View style={{ marginBottom: SPACING.sm }}>
            <CustomButton title={ubicacion ? 'Cambiar ubicación' : 'Agregar ubicación'} onPress={handleUbicacion} />
            {loadingUbic && <ActivityIndicator style={{ marginTop: SPACING.sm }} />}
            {ubicacion ? (
              <View style={styles.infoBox}>
                <Text>📍 {ubicacion.direccion}</Text>
                <Text style={{ color: COLORS.textSecondary, marginTop: 4 }}>{`${ubicacion.latitude.toFixed(5)}, ${ubicacion.longitude.toFixed(5)}`}</Text>
              </View>
            ) : null}
          </View>

          {/* Responsable */}
          <Text style={styles.sectionLabel}>RESPONSABLE</Text>
          <View style={{ marginBottom: SPACING.sm }}>
            <CustomButton title={contacto ? 'Cambiar responsable' : 'Seleccionar responsable'} onPress={handleContactos} />
            {contacto ? (
              <View style={styles.infoBox}>
                <Text>👤 {contacto.nombre}</Text>
              </View>
            ) : null}
          </View>

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
