# 🚀 Inicio Rápido - Firebase App Distribution

## ✅ Lo que ya está hecho

- ✅ Proyecto limpio de código no utilizado
- ✅ Dependencias optimizadas (reducción de ~580 paquetes)
- ✅ Firebase CLI instalado
- ✅ Scripts de build configurados
- ✅ Perfiles de EAS optimizados para distribución

---

## 🎯 Para empezar HOY MISMO

### 1️⃣ Crear Proyecto en Firebase (5 minutos)

```
1. Ve a: https://console.firebase.google.com/
2. Crea un nuevo proyecto llamado "Clarita"
3. Desactiva Google Analytics (opcional)
4. Haz clic en "Crear proyecto"
```

### 2️⃣ Registrar tu App Android (3 minutos)

```
1. En Firebase Console, haz clic en el ícono de Android
2. Nombre del paquete: com.clarita.app
3. Alias: Clarita Android
4. Descarga google-services.json
5. Guarda en: android/app/google-services.json
```

### 3️⃣ Activar App Distribution (1 minuto)

```
1. En Firebase Console → App Distribution
2. Haz clic en "Comenzar"
3. Acepta términos de servicio
```

### 4️⃣ Login con Firebase CLI (1 minuto)

```bash
npx firebase login
```

### 5️⃣ Hacer tu Primer Build (20-30 minutos)

```bash
# Android
npm run build:preview:android

# Espera que termine...
# EAS te dará un link para descargar el APK
```

### 6️⃣ Distribuir en Firebase Console (2 minutos)

```
1. Ve a Firebase Console → App Distribution
2. Haz clic en "Distribuir nueva versión"
3. Arrastra tu APK descargado
4. Agrega email de un tester
5. Notas: "Primera versión de prueba"
6. Haz clic en "Distribuir"
```

---

## 📱 El Tester Recibirá:

1. ✉️ Email con enlace de descarga
2. 📲 Click → Aceptar invitación
3. 📥 Descargar e instalar app
4. ✅ Listo para probar

---

## 🆘 ¿Problemas?

Consulta la guía completa: **FIREBASE_APP_DISTRIBUTION.md**

---

## 💡 Comandos Útiles

```bash
# Ver proyecto
npx firebase projects:list

# Ver apps registradas
npx firebase apps:list

# Build Android
npm run build:preview:android

# Build iOS (requiere Mac)
npm run build:preview:ios

# Build ambas plataformas
npm run build:preview
```

---

## ⏱️ Tiempo Total Estimado

- **Setup inicial**: ~15 minutos
- **Primer build**: ~30 minutos
- **Distribución**: ~2 minutos
- **Total**: ~47 minutos

---

## 🎉 ¡Todo listo!

El proyecto está **100% preparado** para distribución. Solo necesitas completar los 6 pasos arriba y tendrás tu app en manos de testers.

**¿Preguntas?** → Revisa `FIREBASE_APP_DISTRIBUTION.md`

