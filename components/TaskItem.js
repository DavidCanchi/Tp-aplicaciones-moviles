// components/TaskItem.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, RADIUS, SPACING, FONTS } from '../utils/theme';

const PRIORITY_COLORS = {
  alta: COLORS.danger,
  media: COLORS.warning,
  baja: COLORS.success,
};

const PRIORITY_LABELS = {
  alta: '🔴 Alta',
  media: '🟡 Media',
  baja: '🟢 Baja',
};

const TaskItem = ({ task, onToggle, onDelete }) => {
  const priorityColor = PRIORITY_COLORS[task.priority] || COLORS.textMuted;

  return (
    <View style={[styles.container, task.completed && styles.completedContainer]}>
      {/* Priority accent bar */}
      <View style={[styles.accentBar, { backgroundColor: priorityColor }]} />

      <TouchableOpacity style={styles.checkArea} onPress={() => onToggle(task.id)} activeOpacity={0.7}>
        <View style={[styles.checkbox, task.completed && styles.checkboxDone]}>
          {task.completed && <Text style={styles.checkMark}>✓</Text>}
        </View>
      </TouchableOpacity>

      <View style={styles.content}>
        {task.imagen ? (
          <Image source={{ uri: task.imagen }} style={{ width: '100%', height: 80, borderRadius: 6, marginBottom: 4 }} />
        ) : null}
        <Text style={[styles.title, task.completed && styles.titleDone]} numberOfLines={2}>
          {task.title}
        </Text>
        {task.description ? (
          <Text style={styles.description} numberOfLines={1}>
            {task.description}
          </Text>
        ) : null}
        <Text style={[styles.priority, { color: priorityColor }]}>
          {PRIORITY_LABELS[task.priority]}
        </Text>
        <View style={styles.chipsRow}>
          {task.ubicacion ? (
            <View style={styles.chip}><Text>📍 {(task.ubicacion.direccion || '').split(',')[0]}</Text></View>
          ) : null}
          {task.contacto ? (
            <View style={styles.chip}><Text>👤 {task.contacto.nombre}</Text></View>
          ) : null}
        </View>
      </View>

      <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(task.id)} activeOpacity={0.7}>
        <Text style={styles.deleteIcon}>🗑</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  completedContainer: {
    opacity: 0.6,
  },
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  checkArea: {
    padding: SPACING.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkMark: {
    color: COLORS.white,
    fontSize: 14,
    ...FONTS.bold,
  },
  content: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingRight: SPACING.sm,
  },
  title: {
    color: COLORS.text,
    fontSize: 15,
    ...FONTS.semiBold,
    marginBottom: 2,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 4,
  },
  priority: {
    fontSize: 12,
    ...FONTS.medium,
  },
  deleteBtn: {
    padding: SPACING.md,
  },
  deleteIcon: {
    fontSize: 18,
  },
});

export default TaskItem;
