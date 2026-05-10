// utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USERS: 'taskmaster_users',
  CURRENT_USER: 'taskmaster_current_user',
  TASKS: 'taskmaster_tasks',
};

// ── Auth ──────────────────────────────────────────────
export const registerUser = async (username, password) => {
  try {
    const raw = await AsyncStorage.getItem(KEYS.USERS);
    const users = raw ? JSON.parse(raw) : {};

    if (users[username]) {
      return { success: false, message: 'El usuario ya existe.' };
    }

    users[username] = { username, password };
    await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(users));
    return { success: true };
  } catch (e) {
    return { success: false, message: 'Error al registrar.' };
  }
};

export const loginUser = async (username, password) => {
  try {
    const raw = await AsyncStorage.getItem(KEYS.USERS);
    const users = raw ? JSON.parse(raw) : {};

    if (!users[username]) {
      return { success: false, message: 'Usuario no encontrado.' };
    }
    if (users[username].password !== password) {
      return { success: false, message: 'Contraseña incorrecta.' };
    }

    await AsyncStorage.setItem(KEYS.CURRENT_USER, username);
    return { success: true, username };
  } catch (e) {
    return { success: false, message: 'Error al iniciar sesión.' };
  }
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem(KEYS.CURRENT_USER);
};

export const getCurrentUser = async () => {
  return await AsyncStorage.getItem(KEYS.CURRENT_USER);
};

// ── Tasks ─────────────────────────────────────────────
export const getTasks = async (username) => {
  try {
    const raw = await AsyncStorage.getItem(`${KEYS.TASKS}_${username}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveTasks = async (username, tasks) => {
  try {
    await AsyncStorage.setItem(`${KEYS.TASKS}_${username}`, JSON.stringify(tasks));
    return true;
  } catch (e) {
    return false;
  }
};

export const addTask = async (username, task) => {
  const tasks = await getTasks(username);
  const newTask = {
    id: Date.now().toString(),
    title: task.title,
    description: task.description || '',
    priority: task.priority || 'media',
    completed: false,
    createdAt: new Date().toISOString(),
  };
  const updated = [newTask, ...tasks];
  await saveTasks(username, updated);
  return updated;
};

export const deleteTask = async (username, taskId) => {
  const tasks = await getTasks(username);
  const updated = tasks.filter((t) => t.id !== taskId);
  await saveTasks(username, updated);
  return updated;
};

export const toggleTask = async (username, taskId) => {
  const tasks = await getTasks(username);
  const updated = tasks.map((t) =>
    t.id === taskId ? { ...t, completed: !t.completed } : t
  );
  await saveTasks(username, updated);
  return updated;
};
