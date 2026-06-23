jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('expo-notifications', () => ({ requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }) }));
jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  launchCameraAsync: jest.fn().mockResolvedValue({ canceled: false, assets: [{ uri: 'file://photo.jpg' }] }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({ canceled: false, assets: [{ uri: 'file://photo.jpg' }] }),
  MediaTypeOptions: { Images: 'Images' },
}));
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({ coords: { latitude: -34.6037, longitude: -58.3816 } }),
  reverseGeocodeAsync: jest.fn().mockResolvedValue([{ street: 'Av. Corrientes', city: 'Buenos Aires', region: 'CABA' }]),
  Accuracy: { Balanced: 1 },
}));
jest.mock('expo-contacts', () => ({
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getContactsAsync: jest.fn().mockResolvedValue({ data: [{ name: 'Juan Pérez', phoneNumbers: [{ number: '+54 9 11 0000-0000' }] }] }),
  Fields: { Name: 'name', PhoneNumbers: 'phoneNumbers' },
}));
jest.mock('expo-calendar', () => ({
  requestCalendarPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCalendarsAsync: jest.fn().mockResolvedValue([]),
  createCalendarAsync: jest.fn().mockResolvedValue('cal-1'),
  createEventAsync: jest.fn().mockResolvedValue('event-id-1'),
  EntityTypes: { EVENT: 'event' },
  CalendarAccessLevel: { OWNER: 'owner' },
}));

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TaskItem from '../components/TaskItem';
import { obtenerUbicacion } from '../utils/permisos';
import useTaskStore from '../store/useTaskStore';

describe('TaskItem — Componente reutilizable', () => {
  test('title renders correctly', () => {
    const task = { id: '1', title: 'Mi tarea', priority: 'media', completed: false };
    const { getByText } = render(<TaskItem task={task} onToggle={() => {}} onDelete={() => {}} />);
    expect(getByText('Mi tarea')).toBeTruthy();
  });

  test('onToggle is called with task.id when checkbox is pressed', () => {
    const task = { id: '1', title: 'T1', priority: 'media', completed: false };
    const onToggle = jest.fn();
    const { getAllByType } = render(<TaskItem task={task} onToggle={onToggle} onDelete={() => {}} />);
    const touchables = getAllByType(require('react-native').TouchableOpacity);
    // first touchable is checkbox area
    fireEvent.press(touchables[0]);
    expect(onToggle).toHaveBeenCalledWith('1');
  });

  test('completed task has line-through style', () => {
    const task = { id: '2', title: 'Hecha', priority: 'baja', completed: true };
    const { getByText } = render(<TaskItem task={task} onToggle={() => {}} onDelete={() => {}} />);
    const el = getByText('Hecha');
    const styles = Array.isArray(el.props.style) ? Object.assign({}, ...el.props.style) : el.props.style;
    expect(styles.textDecorationLine).toBe('line-through');
  });

  test('ubicacion chip renders when task has ubicacion', () => {
    const task = { id: '3', title: 'Con ubi', priority: 'media', completed: false, ubicacion: { direccion: 'Av. Corrientes, Buenos Aires' } };
    const { getByText } = render(<TaskItem task={task} onToggle={() => {}} onDelete={() => {}} />);
    expect(getByText(/📍/)).toBeTruthy();
  });
});

describe('Lógica de negocio — Validaciones', () => {
  function validarTarea({ title, priority }) {
    const errores = [];
    if (!title || !title.trim()) errores.push('Título inválido');
    if (!['alta', 'media', 'baja'].includes(priority)) errores.push('Prioridad inválida');
    if (title && title.length > 100) errores.push('Título demasiado largo');
    return { valido: errores.length === 0, errores };
  }

  test('empty title returns valido: false', () => {
    expect(validarTarea({ title: '', priority: 'media' }).valido).toBe(false);
  });

  test('whitespace-only title returns valido: false', () => {
    expect(validarTarea({ title: '   ', priority: 'media' }).valido).toBe(false);
  });

  test('valid task returns valido: true with empty errores array', () => {
    const res = validarTarea({ title: 'Comprar leche', priority: 'baja' });
    expect(res.valido).toBe(true);
    expect(res.errores.length).toBe(0);
  });

  test('invalid priority returns valido: false', () => {
    expect(validarTarea({ title: 'T', priority: 'altaaa' }).valido).toBe(false);
  });

  test('title over 100 chars returns valido: false', () => {
    const long = 'a'.repeat(101);
    expect(validarTarea({ title: long, priority: 'media' }).valido).toBe(false);
  });

  test('obtenerUbicacion returns object with latitude, longitude, direccion', async () => {
    const ub = await obtenerUbicacion();
    expect(ub).toHaveProperty('latitude');
    expect(ub).toHaveProperty('longitude');
    expect(ub).toHaveProperty('direccion');
  });
});

describe('Store Zustand — useTaskStore', () => {
  beforeEach(() => {
    useTaskStore.setState({ tasks: [], usuario: null, cargando: false });
  });

  test('initial state has empty tasks array', () => {
    const s = useTaskStore.getState();
    expect(Array.isArray(s.tasks)).toBe(true);
    expect(s.tasks.length).toBe(0);
  });

  test('agregarTarea adds a task to store with correct title and priority', async () => {
    const nueva = await useTaskStore.getState().agregarTarea('u', { title: 'Prueba', priority: 'alta' });
    const s = useTaskStore.getState();
    expect(s.tasks.length).toBe(1);
    expect(s.tasks[0].title).toBe('Prueba');
    expect(s.tasks[0].priority).toBe('alta');
    expect(nueva.id).toBeTruthy();
  });

  test('agregarTarea assigns id and createdAt', async () => {
    const nueva = await useTaskStore.getState().agregarTarea('u', { title: 'T2' });
    expect(nueva.id).toBeTruthy();
    expect(nueva.createdAt).toBeTruthy();
  });

  test('toggleTarea changes completed from false to true and back', async () => {
    const nueva = await useTaskStore.getState().agregarTarea('u', { title: 'Toggle' });
    await useTaskStore.getState().toggleTarea('u', nueva.id);
    let t = useTaskStore.getState().tasks.find(x => x.id === nueva.id);
    expect(t.completed).toBe(true);
    await useTaskStore.getState().toggleTarea('u', nueva.id);
    t = useTaskStore.getState().tasks.find(x => x.id === nueva.id);
    expect(t.completed).toBe(false);
  });

  test('eliminarTarea removes only the correct task by id', async () => {
    const a = await useTaskStore.getState().agregarTarea('u', { title: 'A' });
    const b = await useTaskStore.getState().agregarTarea('u', { title: 'B' });
    expect(useTaskStore.getState().tasks.length).toBeGreaterThanOrEqual(2);
    await useTaskStore.getState().eliminarTarea('u', a.id);
    const ids = useTaskStore.getState().tasks.map(t => t.id);
    expect(ids).not.toContain(a.id);
    expect(ids).toContain(b.id);
  });

  test('setUsuario updates usuario in store', () => {
    useTaskStore.getState().setUsuario('pepito');
    expect(useTaskStore.getState().usuario).toBe('pepito');
  });
});
