# Splash Screen con Lottie

## 📁 Estructura de archivos

```
src/
├── components/
│   └── SplashScreen.tsx          # Componente del splash screen
├── assets/
│   └── animations/
│       ├── splash.json          # Tu archivo JSON de Lottie (coloca aquí tu archivo)
│       └── splash-example.json  # Ejemplo de estructura
└── App.tsx                      # App principal con integración del splash
```

## 🚀 Cómo implementar tu animación

### 1. Coloca tu archivo JSON
- Copia tu archivo JSON de Lottie a `src/assets/animations/splash.json`
- Asegúrate de que el archivo tenga la extensión `.json`

### 2. Descomenta las líneas en App.tsx
```typescript
// Cambia esta línea:
// import splashAnimation from './src/assets/animations/splash.json';

// Por esta:
import splashAnimation from './src/assets/animations/splash.json';
```

### 3. Descomenta la prop en el componente
```typescript
// Cambia esta línea:
// animationSource={splashAnimation}

// Por esta:
animationSource={splashAnimation}
```

## ⚙️ Configuración del SplashScreen

### Props disponibles:
- `onAnimationFinish`: Callback que se ejecuta cuando termina la animación
- `animationSource`: Archivo JSON de Lottie

### Estilos personalizables:
- `width`: Ancho de la animación (por defecto 80% de la pantalla)
- `height`: Alto de la animación (por defecto 60% de la pantalla)
- `backgroundColor`: Color de fondo del splash screen

## 🎨 Personalización

Puedes modificar el componente `SplashScreen.tsx` para:
- Cambiar el tamaño de la animación
- Añadir texto o logo adicional
- Modificar el color de fondo
- Ajustar la duración o comportamiento de la animación

## 📱 Uso

El splash screen se muestra automáticamente al iniciar la app y desaparece cuando termina la animación de Lottie.

## 🔧 Troubleshooting

Si tienes problemas:
1. Verifica que el archivo JSON esté en la ruta correcta
2. Asegúrate de que el archivo JSON sea válido
3. Revisa que la librería `lottie-react-native` esté instalada
4. Reinicia el servidor de desarrollo si es necesario


