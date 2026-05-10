// utils/notifications.js
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

export const scheduleTaskReminder = async (taskTitle, secondsFromNow = 5) => {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📋 Recordatorio de tarea',
        body: `No olvides: ${taskTitle}`,
        sound: true,
      },
      trigger: {
        seconds: secondsFromNow,
      },
    });
    return id;
  } catch (e) {
    console.log('Notification error:', e);
    return null;
  }
};

export const scheduleDailyReminder = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '✅ TaskMaster',
        body: '¡Revisá tus tareas pendientes de hoy!',
        sound: true,
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });
    return id;
  } catch (e) {
    console.log('Daily reminder error:', e);
    return null;
  }
};
