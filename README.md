# ✅ TaskMaster — Gestor de Tareas

> Parcial 1 – Aplicaciones Móviles | React Native + Expo

---

## 📋 Opción elegida

**Gestor de Tareas** — Permite registrarse, iniciar sesión, crear tareas con prioridad (alta/media/baja), marcarlas como completadas, eliminarlas y recibir notificaciones locales de recordatorio.

---

## 🚀 Cómo ejecutar la app

### Requisitos previos

- Node.js 18+
- npm o yarn
- Expo Go instalado en el celular (iOS o Android) — descargalo desde la App Store / Play Store

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/taskmaster.git
cd taskmaster

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npx expo start

# 4. Escanear el QR con Expo Go (Android) o la cámara (iOS)
```

> **Alternativa:** Para correr en emulador:
> - Android: presioná `a` en la terminal
> - iOS: presioná `i` en la terminal

---

## ✨ Funcionalidades implementadas

| Requisito | Estado |
|-----------|--------|
| Componentes básicos (View, Text, TextInput, Button, TouchableOpacity) | ✅ |
| StyleSheet para todos los estilos | ✅ |
| Componentes reutilizables (TaskItem, CustomButton, InputField) | ✅ |
| React Navigation - Stack Navigation | ✅ |
| Pantalla Login | ✅ |
| Pantalla Registro | ✅ |
| Pantalla Home (lista de tareas) | ✅ |
| Pantalla Alta de tarea | ✅ |
| Autenticación local con AsyncStorage | ✅ |
| Sin backend (100% local) | ✅ |
| Persistencia de datos con AsyncStorage | ✅ |
| Agregar tareas | ✅ |
| Mostrar lista de tareas | ✅ |
| Eliminar tareas | ✅ |
| Marcar tareas como completadas | ✅ |
| Notificación local de recordatorio | ✅ |
| Prioridades: alta / media / baja | ✅ |
| Estadísticas (total / pendientes / completadas) | ✅ |
| Sesión persistente (no re-login al reabrir) | ✅ |

---

## 🧱 Estructura del proyecto

```
TaskMaster/
├── App.js                    # Entrada principal + navegación
├── app.json                  # Configuración Expo
├── package.json
├── utils/
│   ├── theme.js              # Colores, tipografía, espaciado
│   ├── storage.js            # AsyncStorage (auth + tareas)
│   └── notifications.js      # Notificaciones locales
├── components/
│   ├── CustomButton.js       # Botón reutilizable
│   ├── TaskItem.js           # Ítem de lista reutilizable
│   └── InputField.js         # Input reutilizable
└── screens/
    ├── LoginScreen.js
    ├── RegisterScreen.js
    ├── HomeScreen.js
    └── AddTaskScreen.js
```

---

## 📱 Video DEMO

🎬 [Ver demo en YouTube](https://youtube.com/TU_ENLACE_AQUI)

> *(Reemplazar con el enlace real al subir el video)*

---

## 🛠 Tecnologías utilizadas

- React Native 0.73
- Expo ~50
- React Navigation v6 (Stack)
- AsyncStorage
- expo-notifications

---

## 👨‍💻 Autor

Nombre: *[Tu nombre]*  
Materia: Aplicaciones Móviles  
Institución: ISTEA  
Fecha de entrega: 12/05/2026
