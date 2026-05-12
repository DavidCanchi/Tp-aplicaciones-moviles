// utils/notifications.js
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// ─── Handler global (debe llamarse una sola vez, desde App.js) ───────────────
export function configurarHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

// ─── Permisos ─────────────────────────────────────────────────────────────────
export const requestPermissions = async () => {
  try {
    if (Platform.OS === 'android') {
      // En Android 13+ (API 33) hay que pedir POST_NOTIFICATIONS
      await Notifications.setNotificationChannelAsync('default', {
        name: 'TaskMaster',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6c63ff',
        sound: 'default',
      });
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (e) {
    console.log('Permission error:', e);
    return false;
  }
};

// ─── Notificación de recordatorio de tarea ────────────────────────────────────
export const scheduleTaskReminder = async (taskTitle, secondsFromNow = 10) => {
  try {
    const granted = await requestPermissions();
    if (!granted) {
      console.log('Permisos de notificación denegados');
      return null;
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📋 Recordatorio de tarea',
        body: `No olvides: ${taskTitle}`,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.MAX,
        // Android específico
        ...(Platform.OS === 'android' && {
          channelId: 'default',
        }),
      },
      trigger: {
        seconds: secondsFromNow,
        channelId: 'default',  // requerido en Android
      },
    });

    console.log('Notificación programada con ID:', id);
    return id;
  } catch (e) {
    console.log('Notification error:', e);
    return null;
  }
};

// ─── Recordatorio diario ──────────────────────────────────────────────────────
export const scheduleDailyReminder = async () => {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '✅ TaskMaster',
        body: '¡Revisá tus tareas pendientes de hoy!',
        sound: 'default',
        ...(Platform.OS === 'android' && { channelId: 'default' }),
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
        channelId: 'default',
      },
    });
    return id;
  } catch (e) {
    console.log('Daily reminder error:', e);
    return null;
  }
};
