# 🚀 Configurar GitHub Actions para Build Automático

## ✅ Push Exitoso

El código ya está en GitHub. Ahora necesitas configurar un secreto para que GitHub Actions pueda compilar la app.

## 📝 Pasos para Activar GitHub Actions

### 1. Agregar el archivo `google-services.json` como secreto

1. Ve a tu repositorio: https://github.com/illtauga/clarita
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, haz clic en **Secrets and variables** → **Actions**
4. Haz clic en **New repository secret**
5. Configura:
   - **Name:** `GOOGLE_SERVICES_JSON`
   - **Value:** Pega el contenido completo del archivo `android/app/google-services.json`
6. Haz clic en **Add secret**

### 2. Activar GitHub Actions

1. Ve a la pestaña **Actions** en tu repositorio
2. Si aparece un botón para activar workflows, haz clic en él
3. El workflow `Android Build` debería aparecer en la lista

### 3. Ejecutar el Build

**Opción A: Push automático**
- Cada vez que hagas push a `master`, se generará el APK automáticamente

**Opción B: Manual**
1. Ve a **Actions** → **Android Build**
2. Haz clic en **Run workflow**
3. Selecciona la rama `master`
4. Haz clic en **Run workflow**

### 4. Descargar el APK

Una vez que el build termine (toma ~10-15 minutos):
1. Ve a **Actions** → selecciona el workflow completado
2. En la sección **Artifacts**, descarga `android-app-release`
3. Descomprime el archivo ZIP
4. El APK estará listo para distribuir

---

## 🔥 Subir a Firebase App Distribution

### Opción 1: Desde la consola web (Más fácil)

1. Ve a https://console.firebase.google.com
2. Selecciona tu proyecto
3. En el menú lateral, ve a **App Distribution**
4. Haz clic en **Get started** (si es la primera vez)
5. Haz clic en **Distribute app**
6. Arrastra el APK descargado desde GitHub Actions
7. Agrega los correos de los testers
8. Haz clic en **Distribute to testers**

### Opción 2: Desde la terminal (Automático)

```bash
# Instalar Firebase CLI (si no lo tienes)
npm install -g firebase-tools

# Login
firebase login

# Distribuir
firebase appdistribution:distribute android/app/build/outputs/apk/release/app-release.apk \
  --app YOUR_FIREBASE_APP_ID \
  --groups testers \
  --release-notes "Primera versión de prueba"
```

---

## 📱 Los testers recibirán

1. Un correo con el link de descarga
2. Instrucciones para instalar el APK
3. Notificaciones de nuevas versiones

---

## ✅ Resumen

1. ✅ Código en GitHub
2. ⏳ Configurar secreto `GOOGLE_SERVICES_JSON`
3. ⏳ Ejecutar workflow en Actions
4. ⏳ Descargar APK
5. ⏳ Subir a Firebase App Distribution

**¿Listo para configurar el secreto?** 🔐

