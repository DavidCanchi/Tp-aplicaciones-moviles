import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = 'taskmaster_tasks';
const USER_KEY  = 'taskmaster_current_user';

const useTaskStore = create((set, get) => ({
  tasks: [],
  usuario: null,
  cargando: false,

  setUsuario: (usuario) => set({ usuario }),

  cargarUsuario: async () => {
    const u = await AsyncStorage.getItem(USER_KEY);
    set({ usuario: u });
    return u;
  },

  cargarTareas: async (username) => {
    set({ cargando: true });
    try {
      const raw = await AsyncStorage.getItem(`${TASKS_KEY}_${username}`);
      const tasks = raw ? JSON.parse(raw) : [];
      set({ tasks, cargando: false });
    } catch {
      set({ cargando: false });
    }
  },

  _persistir: async (username, tasks) => {
    await AsyncStorage.setItem(`${TASKS_KEY}_${username}`, JSON.stringify(tasks));
  },

  agregarTarea: async (username, datos) => {
    const nueva = {
      id: Date.now().toString(),
      title:       datos.title,
      description: datos.description || '',
      priority:    datos.priority || 'media',
      completed:   false,
      imagen:      datos.imagen || null,
      ubicacion:   datos.ubicacion || null,
      contacto:    datos.contacto || null,
      createdAt:   new Date().toISOString(),
    };
    const actualizadas = [nueva, ...get().tasks];
    set({ tasks: actualizadas });
    await get()._persistir(username, actualizadas);
    return nueva;
  },

  eliminarTarea: async (username, id) => {
    const actualizadas = get().tasks.filter(t => t.id !== id);
    set({ tasks: actualizadas });
    await get()._persistir(username, actualizadas);
  },

  toggleTarea: async (username, id) => {
    const actualizadas = get().tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    set({ tasks: actualizadas });
    await get()._persistir(username, actualizadas);
  },
}));

export default useTaskStore;
