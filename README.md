# ✅ TaskMaster — Gestor de Tareas

> Parcial 1 – Aplicaciones Móviles | React Native + Expo

---

## 📋 Opción elegida

**Gestor de Tareas** — Permite registrarse, iniciar sesión, crear tareas con prioridad (alta/media/baja), marcarlas como completadas, eliminarlas y recibir notificaciones locales de recordatorio.

---

## 🚀 Cómo ejecutar la app

### Versiones utilizadas en este proyecto

- Node.js: 18.x o más reciente
- npm: 10.x (o la versión que viene con Node 18+)
- Expo SDK: ~50.0.0
- React Native: 0.73.6
- Expo Notifications: ~0.27.0

> Si usas una versión distinta de Node o npm, puede funcionar, pero lo recomendado para este proyecto es Node 18.x.

---

## 🧩 Requisitos previos

### Para Windows

1. Instalar Node.js 18.x desde https://nodejs.org/
2. Verificar que `npm` funciona desde PowerShell o CMD:
   ```powershell
   node -v
   npm -v
   ```
3. Instalar Expo CLI globalmente (opcional, también se puede usar `npx`):
   ```powershell
   npm install -g expo-cli
   ```
4. Descargar Expo Go en el celular desde Google Play o App Store.
5. Si quieres usar emulador Android, instala Android Studio y configura un AVD.
   - Usa un emulador Pixel 5 con Android 14 (API 34).
   - No instales un emulador demasiado reciente, ya que puede dar problemas de compatibilidad.

#### Script sugerido para Windows

Crea un archivo `setup-windows.ps1` con este contenido y ejecútalo desde PowerShell como administrador:

```powershell
# setup-windows.ps1
Write-Host "Instalando dependencias para TaskMaster..."

choco install nodejs-lts -y
npm install -g expo-cli
npm install
Write-Host "Listo. Ejecuta 'npx expo start' para iniciar la app."
```

> Si no tienes Chocolatey, instala Node.js manualmente desde https://nodejs.org/.

### Para Linux

1. Instalar Node.js 18.x.
2. Verificar `node` y `npm`:
   ```bash
   node -v
   npm -v
   ```
3. Instalar Expo CLI globalmente si lo deseas:
   ```bash
   npm install -g expo-cli
   ```
4. Instalar `git` si no está instalado.
5. Instalar Android Studio y configurar un AVD.
   - Usa un emulador Pixel 5 con Android 14 (API 34).
   - No instales un emulador demasiado reciente, ya que puede dar problemas de compatibilidad.

#### Script sugerido para Linux

Crea un archivo `setup-linux.sh` y ejecútalo desde la terminal:

```bash
#!/bin/bash
set -e

echo "Instalando dependencias para TaskMaster..."

sudo apt update
sudo apt install -y curl git
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
npm install -g expo-cli
npm install

echo "Listo. Ejecuta 'npx expo start' para iniciar la app."
```

> Ajusta el script si tu distribución no usa `apt`.

---

## 🧪 Pasos para ejecutar el proyecto

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/taskmaster.git
cd taskmaster

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npx expo start
```

### Abrir la app

- Con Expo Go en el celular: escanea el código QR que aparece en la terminal o en la pantalla de Expo.
- En Windows o Linux con emulador Android:
  - Presiona `a` en la terminal para abrir Android.
- En macOS con emulador iOS (si corresponde):
  - Presiona `i` en la terminal.

### Comandos útiles

- `npm run start` — inicia Expo.
- `npm run android` — ejecuta la app en un dispositivo/emulador Android.
- `npm run ios` — ejecuta la app en iOS (solo macOS).
- `npm run web` — abre la app en el navegador.

---

## ⚠️ Problemas comunes y soluciones

- `npm install` falla:
  - Verifica que estás usando Node 18.x.
  - Elimina `node_modules` y vuelve a ejecutar `npm install`.
- `expo start` no arranca:
  - Asegúrate de tener red y permisos en el firewall.
  - Prueba `npx expo start --tunnel` si el QR no se conecta.
- El celular no conecta al QR:
  - Que el celular y la PC estén en la misma red Wi-Fi.
  - También puedes usar `localhost` o `tunnel` en la pantalla de Expo.

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

## 🆕 Nuevas funcionalidades (Parcial 2)

Se añadieron mejoras y funcionalidades solicitadas para la entrega Parcial 2:

- **Estado global con Zustand:** se incorporó un store en `store/useTaskStore.js` para manejar tareas, usuario y persistencia con `AsyncStorage`.
- **Módulos nativos Expo:** integración con `expo-image-picker`, `expo-location`, `expo-contacts` y `expo-calendar` para fotos, ubicación, contactos y eventos de calendario.
- **Utilidad de permisos y APIs:** `utils/permisos.js` centraliza los pedidos de permiso y wrappers para cámara, galería, ubicación, contactos y calendario. La función solicita permisos y obtiene la ubicación del dispositivo cuando está disponible; en desarrollo el comportamiento puede ajustarse para facilitar pruebas.
- **Alta de tarea mejorada:** la pantalla `AddTaskScreen.js` permite adjuntar foto, agregar ubicación, seleccionar responsable desde contactos y programar recordatorios. También puede crear un evento en el calendario cuando corresponde.
- **Tests ajustados:** se agregó una suite de tests en `__tests__/taskmaster.test.js` con exactamente 3 pruebas (componentes, lógica y store). Se usa `jest-expo` y React Native Testing Library / react-test-renderer.
- **Scripts y configuración de test:** `package.json` y la configuración de Jest fueron actualizados para ejecutar los tests con `npm test`.
- **Comportamiento de guardado:** se mantuvo la persistencia local; la UX de recordatorios/creación de eventos puede mostrar avisos si los permisos son denegados — se recomienda revisar la lógica de permisos si se desea otra conducta.

Si querés, puedo también:

- Mover la verificación de permisos antes del guardado (para evitar alerts contradictorios).
- Ejecutar `npm install` y `npx expo start` aquí para probar el flujo (necesita entorno con Android SDK/AVD o Expo Go).


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

🎬 [Ver demo en YouTube](https://www.youtube.com/watch?v=YoNXR5vrWC4)

---

## 🛠 Tecnologías utilizadas

- Expo SDK ~50.0.0
- React Native 0.73.6
- React 18.2.0
- npm 10.x (recomendado con Node 18.x)
- React Navigation v6 (Stack)
- @react-native-async-storage/async-storage 1.21.0
- expo-notifications ~0.27.0

---

## 👨‍💻 Autor

Nombre: *[Tu nombre]*  
Materia: Aplicaciones Móviles  
Institución: ISTEA  
Fecha de entrega: 12/05/2026
