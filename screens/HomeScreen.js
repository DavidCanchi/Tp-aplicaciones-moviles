// screens/HomeScreen.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SPACING, FONTS, RADIUS } from '../utils/theme';
import { getTasks, deleteTask, toggleTask, logoutUser } from '../utils/storage';
import { requestPermissions, scheduleDailyReminder } from '../utils/notifications';
import TaskItem from '../components/TaskItem';

const HomeScreen = ({ route, navigation }) => {
  const { username } = route.params;
  const [tasks, setTasks] = useState([]);

  // Reload tasks every time screen is focused
  useFocusEffect(
    useCallback(() => {
      loadTasks();
      setupNotifications();
    }, [])
  );

  const loadTasks = async () => {
    const data = await getTasks(username);
    setTasks(data);
  };

  const setupNotifications = async () => {
    const granted = await requestPermissions();
    if (granted) {
      await scheduleDailyReminder();
    }
  };

  const handleToggle = async (taskId) => {
    const updated = await toggleTask(username, taskId);
    setTasks(updated);
  };

  const handleDelete = (taskId) => {
    Alert.alert(
      'Eliminar tarea',
      '¿Estás seguro que querés eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const updated = await deleteTask(username, taskId);
            setTasks(updated);
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que querés salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        onPress: async () => {
          await logoutUser();
          navigation.replace('Login');
        },
      },
    ]);
  };

  // Stats
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const pending = total - done;

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>📭</Text>
      <Text style={styles.emptyTitle}>Sin tareas todavía</Text>
      <Text style={styles.emptyText}>
        Tocá el botón + para agregar tu primera tarea
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, {username} 👋</Text>
          <Text style={styles.subtitle}>Tus tareas de hoy</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>🚪</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      {total > 0 && (
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={[styles.statCard, styles.statCardPending]}>
            <Text style={[styles.statNum, { color: COLORS.warning }]}>{pending}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
          <View style={[styles.statCard, styles.statCardDone]}>
            <Text style={[styles.statNum, { color: COLORS.success }]}>{done}</Text>
            <Text style={styles.statLabel}>Completadas</Text>
          </View>
        </View>
      )}

      {/* Task list */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem task={item} onToggle={handleToggle} onDelete={handleDelete} />
        )}
        ListEmptyComponent={EmptyState}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTask', { username })}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  greeting: {
    color: COLORS.text,
    fontSize: 24,
    ...FONTS.bold,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: COLORS.surface,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  logoutIcon: {
    fontSize: 20,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statCardPending: {
    borderColor: COLORS.warning + '44',
  },
  statCardDone: {
    borderColor: COLORS.success + '44',
  },
  statNum: {
    color: COLORS.text,
    fontSize: 26,
    ...FONTS.heavy,
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    ...FONTS.medium,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  list: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: SPACING.xxl,
  },
  emptyEmoji: {
    fontSize: 72,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 20,
    ...FONTS.bold,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  fabIcon: {
    color: COLORS.white,
    fontSize: 32,
    lineHeight: 36,
    ...FONTS.regular,
  },
});

export default HomeScreen;
