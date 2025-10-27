# 🚀 Firebase App Distribution - Guía Completa

Esta guía te ayudará a configurar Firebase App Distribution para distribuir versiones de prueba de Clarita de manera gratuita y profesional.

## 📋 Tabla de Contenidos
- [¿Qué es Firebase App Distribution?](#qué-es-firebase-app-distribution)
- [Requisitos Previos](#requisitos-previos)
- [Configuración Inicial](#configuración-inicial)
- [Distribución de Builds](#distribución-de-builds)
- [Gestión de Testers](#gestión-de-testers)
- [Comandos Útiles](#comandos-útiles)

---

## 🎯 ¿Qué es Firebase App Distribution?

Firebase App Distribution es una plataforma gratuita de Google que te permite:

- ✅ **Distribución ilimitada** de builds a testers
- ✅ **Enlaces directos** para descargar las apps
- ✅ **Notificaciones automáticas** cuando hay nuevas versiones
- ✅ **Gestión de testers** por grupos
- ✅ **Compatible** con Android e iOS
- ✅ **Completamente gratuito** (hasta 200 distribuciones/mes por proyecto)

---

## 📦 Requisitos Previos

### 1. Cuenta de Google
Necesitas una cuenta de Google (Gmail) para acceder a Firebase Console.

### 2. Herramientas Instaladas
```bash
# Verificar que tienes EAS CLI instalado
npx eas-cli --version

# Si no está instalado:
npm install -g eas-cli
```

### 3. Dependencias del Proyecto
Ya están instaladas en el proyecto:
- ✅ `firebase-tools` - CLI de Firebase
- ✅ EAS Build configurado

---

## 🔧 Configuración Inicial

### Paso 1: Crear Proyecto en Firebase

1. **Ve a Firebase Console**: https://console.firebase.google.com/
2. **Crea un nuevo proyecto**:
   - Haz clic en "Agregar proyecto"
   - Nombre del proyecto: `Clarita` (o el que prefieras)
   - Desactiva Google Analytics (opcional para esta funcionalidad)
   - Haz clic en "Crear proyecto"

### Paso 2: Registrar tu App en Firebase

#### Para Android:

1. En el dashboard del proyecto, haz clic en el ícono de Android
2. Completa los datos:
   - **Nombre del paquete Android**: `com.clarita.app` (debe coincidir con `app.json`)
   - **Alias de la app**: `Clarita Android`
   - **Certificado SHA-1**: Opcional por ahora
3. Haz clic en "Registrar app"
4. **Descarga el archivo `google-services.json`**
5. Guarda este archivo en: `android/app/google-services.json`

#### Para iOS:

1. En el dashboard del proyecto, haz clic en el ícono de iOS
2. Completa los datos:
   - **ID del paquete de iOS**: `com.clarita.app` (debe coincidir con `app.json`)
   - **Alias de la app**: `Clarita iOS`
3. Haz clic en "Registrar app"
4. **Descarga el archivo `GoogleService-Info.plist`**
5. Guarda este archivo en: `ios/GoogleService-Info.plist`

### Paso 3: Configurar Firebase en el Proyecto

#### Android - Actualizar `android/app/build.gradle`:

```gradle
// En la parte superior, después de otros plugins
plugins {
    id 'com.android.application'
    // Agrega esta línea:
    id 'com.google.gms.google-services'
}

// ... resto del archivo
```

#### Android - Actualizar `android/build.gradle`:

```gradle
buildscript {
    dependencies {
        // ... otras dependencias
        classpath 'com.google.gms:google-services:4.4.0'
    }
}
```

### Paso 4: Inicializar Firebase CLI

```bash
# Login en Firebase
npx firebase login

# Inicializar Firebase en el proyecto
npx firebase init

# Selecciona:
# - App Distribution (usa espacio para seleccionar)
# - Selecciona tu proyecto existente
# - Acepta configuración por defecto
```

### Paso 5: Activar App Distribution

1. Ve a Firebase Console → Tu proyecto
2. En el menú lateral, busca **"App Distribution"** (bajo "Release & Monitor")
3. Haz clic en "Comenzar"
4. Lee y acepta los términos de servicio

---

## 🚀 Distribución de Builds

### Opción 1: Build Local + Distribución Manual

#### Android:

```bash
# 1. Construir APK con EAS
npm run build:preview:android

# 2. Espera a que el build termine y descarga el APK

# 3. Distribuir a Firebase
npx firebase appdistribution:distribute ruta/al/archivo.apk \
  --app TU_APP_ID \
  --groups "testers" \
  --release-notes "Versión de prueba $(date '+%Y-%m-%d')"
```

#### iOS:

```bash
# 1. Construir IPA con EAS
npm run build:preview:ios

# 2. Espera a que el build termine y descarga el IPA

# 3. Distribuir a Firebase
npx firebase appdistribution:distribute ruta/al/archivo.ipa \
  --app TU_APP_ID \
  --groups "testers" \
  --release-notes "Versión de prueba $(date '+%Y-%m-%d')"
```

### Opción 2: Automatización con EAS Build Hooks

Crea un archivo `eas-hooks.js` en la raíz del proyecto:

```javascript
// eas-hooks.js
const { execSync } = require('child_process');

module.exports = {
  onBuildComplete: async (ctx) => {
    const { platform, buildPath, appId } = ctx;
    
    if (platform === 'android' || platform === 'ios') {
      console.log(`Distribuyendo build de ${platform} a Firebase...`);
      
      try {
        execSync(
          `npx firebase appdistribution:distribute ${buildPath} \
            --app ${appId} \
            --groups testers \
            --release-notes "Build automático ${new Date().toISOString()}"`,
          { stdio: 'inherit' }
        );
        console.log('✅ Build distribuido exitosamente');
      } catch (error) {
        console.error('❌ Error al distribuir:', error);
      }
    }
  },
};
```

### Opción 3: Usar Firebase Console (Más Simple)

1. Ve a Firebase Console → App Distribution
2. Haz clic en "Distribuir nueva versión"
3. Sube tu APK o IPA
4. Selecciona testers o grupos
5. Agrega notas de lanzamiento
6. Haz clic en "Distribuir"

---

## 👥 Gestión de Testers

### Agregar Testers Individuales

1. Ve a Firebase Console → App Distribution → Testers & Groups
2. Haz clic en "Agregar testers"
3. Ingresa los emails de los testers (separados por coma)
4. Haz clic en "Agregar"

### Crear Grupos de Testers

1. Ve a la pestaña "Groups"
2. Haz clic en "Crear grupo"
3. Nombre del grupo: `testers`, `qa-team`, `beta-users`, etc.
4. Agrega testers al grupo
5. Guarda

### CLI - Agregar Testers

```bash
# Agregar tester individual
npx firebase appdistribution:testers:add \
  --emails "tester@example.com" \
  --app TU_APP_ID

# Agregar múltiples testers
npx firebase appdistribution:testers:add \
  --emails "tester1@example.com,tester2@example.com" \
  --app TU_APP_ID

# Agregar a un grupo
npx firebase appdistribution:testers:add \
  --emails "tester@example.com" \
  --groups "testers" \
  --app TU_APP_ID
```

---

## 📱 Proceso para Testers

### Android:

1. El tester recibe un email con un enlace
2. Hace clic en el enlace
3. Acepta la invitación
4. Descarga la app desde el navegador
5. En Android, habilita "Instalar apps de fuentes desconocidas"
6. Instala la app

### iOS:

1. El tester recibe un email con un enlace
2. Hace clic en el enlace desde el dispositivo iOS
3. Acepta la invitación
4. El dispositivo debe estar registrado en tu cuenta de desarrollador
5. Descarga e instala el perfil de aprovisionamiento
6. Descarga e instala la app

**Nota**: Para iOS, necesitas agregar los UDIDs de los dispositivos de prueba en tu cuenta de Apple Developer.

---

## 🛠️ Comandos Útiles

### Información del Proyecto

```bash
# Ver apps registradas
npx firebase apps:list

# Ver detalles de una app
npx firebase apps:sdkconfig PLATFORM APP_ID
```

### Gestión de Builds

```bash
# Listar builds distribuidos
npx firebase appdistribution:builds \
  --app TU_APP_ID

# Eliminar un build
npx firebase appdistribution:builds:delete BUILD_ID \
  --app TU_APP_ID
```

### Scripts del Proyecto

```bash
# Construir preview para Android
npm run build:preview:android

# Construir preview para iOS
npm run build:preview:ios

# Construir ambas plataformas
npm run build:preview

# Construir versión de producción
npm run build:production
```

---

## 🔑 Obtener tu App ID de Firebase

### Desde Firebase Console:

1. Ve a Project Settings (⚙️ en la esquina superior izquierda)
2. Baja hasta "Your apps"
3. Verás tus apps Android e iOS
4. El **App ID** es el que dice `1:XXXXXXX:android:XXXXXXX` o similar

### Desde CLI:

```bash
npx firebase apps:list
```

---

## 📊 Ventajas sobre otras opciones

| Característica | Firebase App Distribution | TestFlight (iOS) | Google Play Console (Android) |
|---|---|---|---|
| Precio | ✅ Gratis | ✅ Gratis | ✅ Gratis |
| Setup | ⚡ Rápido | 🐢 Lento | 🐢 Lento |
| Límite de testers | 200+ distribuciones/mes | 10,000 testers | Requiere cuenta de dev |
| Notificaciones | ✅ Automáticas | ✅ Automáticas | ❌ Manual |
| Multi-plataforma | ✅ Android + iOS | ❌ Solo iOS | ❌ Solo Android |
| Notas de versión | ✅ Sí | ✅ Sí | ✅ Sí |
| Revisión de Apple | ❌ No requerida | ✅ Requerida | ❌ No requerida |

---

## 🎯 Workflow Recomendado

### Para Desarrollo Activo:

```bash
# 1. Hacer cambios en el código
# 2. Construir preview
npm run build:preview:android

# 3. Esperar que termine el build
# 4. Descargar desde EAS dashboard
# 5. Distribuir a Firebase Console (arrastrar archivo)
```

### Para Releases Frecuentes:

Usa la Opción 2 con hooks automáticos o integra con CI/CD (GitHub Actions).

---

## 🆘 Solución de Problemas

### "Failed to authenticate"

```bash
# Re-autenticar con Firebase
npx firebase logout
npx firebase login
```

### "App not found"

Verifica que el App ID sea correcto:
```bash
npx firebase apps:list
```

### "Build upload failed"

- Verifica que el archivo exista
- Verifica permisos del archivo
- Verifica conexión a internet

### Android: "No se puede instalar la app"

El tester debe habilitar "Instalar apps de fuentes desconocidas" en Configuración → Seguridad.

### iOS: "No se puede instalar la app"

- Verifica que el UDID del dispositivo esté registrado
- Verifica que el perfil de aprovisionamiento sea correcto
- El dispositivo debe tener iOS 11 o superior

---

## 📝 Notas Importantes

1. **No compartas** los archivos `google-services.json` o `GoogleService-Info.plist` públicamente
2. **Agrega estos archivos** a `.gitignore` si contienen información sensible
3. **Firebase App Distribution es gratuito** para hasta 200 distribuciones/mes por proyecto
4. **Los testers no necesitan** cuenta de Firebase
5. **Los builds expiran** después de 150 días (configurable)

---

## 🎉 ¡Listo!

Ahora puedes distribuir versiones de prueba de Clarita de forma profesional y gratuita. Tus testers recibirán notificaciones automáticas cada vez que subas una nueva versión.

### Próximos Pasos:

1. ✅ Crear proyecto en Firebase Console
2. ✅ Registrar apps Android e iOS
3. ✅ Agregar archivos de configuración
4. ✅ Hacer tu primer build con EAS
5. ✅ Distribuir tu primer build a testers
6. ✅ Invitar a tus testers

---

**¿Necesitas ayuda?** Consulta la [documentación oficial de Firebase](https://firebase.google.com/docs/app-distribution)

