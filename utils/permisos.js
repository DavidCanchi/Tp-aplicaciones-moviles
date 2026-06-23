import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar';

export async function pedirPermisoCamara() {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status === 'denied') {
    Alert.alert('Permiso denegado', 'No se puede acceder a la cámara. Habilitalo en Ajustes > Aplicaciones > TaskMaster.');
    return false;
  }
  return status === 'granted';
}

export async function pedirPermisoGaleria() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status === 'denied') {
    Alert.alert('Permiso denegado', 'No se puede acceder a la galería. Habilitalo en Ajustes > Aplicaciones > TaskMaster.');
    return false;
  }
  return status === 'granted';
}

export async function tomarFoto() {
  const ok = await pedirPermisoCamara();
  if (!ok) return null;
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.7,
  });
  if (result.canceled) return null;
  return result.assets[0].uri;
}

export async function elegirDeGaleria() {
  const ok = await pedirPermisoGaleria();
  if (!ok) return null;
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.7,
  });
  if (result.canceled) return null;
  return result.assets[0].uri;
}

export async function pedirPermisoUbicacion() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status === 'denied') {
    Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación. Habilitalo en Ajustes > Aplicaciones > TaskMaster.');
    return false;
  }
  return status === 'granted';
}

export async function obtenerUbicacion() {
  // Always request permission first so the user is prompted even when using a hardcoded location.
  const ok = await pedirPermisoUbicacion();
  if (!ok) return null;

  // Hardcoded location for development (works with `npx expo start` / Expo Go)
  const HARDCODE_LOCATION = true;
  const HARDCODE_COORDS = { latitude: -34.8083069, longitude: -58.4835484, direccion: 'Chimondegui 980, Monte Grande' };
  if (HARDCODE_LOCATION) {
    return HARDCODE_COORDS;
  }

  try {
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    const { latitude, longitude } = loc.coords;
    let direccion = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    try {
      const geo = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geo.length > 0) {
        const g = geo[0];
        const partes = [g.street, g.city, g.region].filter(Boolean);
        if (partes.length > 0) direccion = partes.join(', ');
      }
    } catch {}
    return { latitude, longitude, direccion };
  } catch {
    Alert.alert('Error', 'No se pudo obtener la ubicación. Intentá de nuevo.');
    return null;
  }
}

export async function pedirPermisoContactos() {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status === 'denied') {
    Alert.alert('Permiso denegado', 'No se puede acceder a los contactos. Habilitalo en Ajustes > Aplicaciones > TaskMaster.');
    return false;
  }
  return status === 'granted';
}

export async function obtenerContactos() {
  const ok = await pedirPermisoContactos();
  if (!ok) return null;
  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
  });
  return data || [];
}

export async function pedirPermisoCalendario() {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status === 'denied') {
    Alert.alert('Permiso denegado', 'No se puede acceder al calendario. Habilitalo en Ajustes > Aplicaciones > TaskMaster.');
    return false;
  }
  return status === 'granted';
}

export async function crearEventoCalendario(titulo, fecha, notas = '') {
  const ok = await pedirPermisoCalendario();
  if (!ok) return null;
  try {
    const calendarios = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    let calId = null;
    const tmCal = calendarios.find(c => c.title === 'TaskMaster');
    if (tmCal) {
      calId = tmCal.id;
    } else {
      const defaultCal = calendarios.find(c => c.allowsModifications && c.type !== 'birthday');
      calId = await Calendar.createCalendarAsync({
        title: 'TaskMaster',
        color: '#6c63ff',
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCal?.source?.id,
        source: defaultCal?.source,
        name: 'TaskMaster',
        ownerAccount: 'personal',
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });
    }
    const inicio = new Date(fecha);
    const fin = new Date(inicio.getTime() + 60 * 60 * 1000);
    const eventoId = await Calendar.createEventAsync(calId, {
      title: `📋 ${titulo}`,
      startDate: inicio,
      endDate: fin,
      notes: notas,
      alarms: [{ relativeOffset: -30 }],
    });
    return eventoId;
  } catch (e) {
    Alert.alert('Error', 'No se pudo crear el evento en el calendario.');
    return null;
  }
}
