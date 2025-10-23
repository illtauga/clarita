# Storybook para Clarita

Este proyecto utiliza Storybook para React Native para desarrollar y documentar el sistema de diseño.

## 📖 ¿Qué es Storybook?

Storybook es una herramienta que permite desarrollar componentes UI de forma aislada, documentarlos y probarlos sin necesidad de ejecutar toda la aplicación.

## 🚀 Cómo usar

### Ver Storybook en la app

1. **Iniciar Storybook:**
   ```bash
   npm run storybook
   ```

2. **O directamente en un dispositivo:**
   ```bash
   npm run storybook:android  # Para Android
   npm run storybook:ios      # Para iOS
   ```

### Actualizar historias

Cada vez que agregues o modifiques un archivo `.stories.tsx`, ejecuta:

```bash
npm run update-stories
```

Esto regenerará el archivo `.storybook/storybook.requires.ts` con todas las historias disponibles.

## 📁 Estructura

```
src/
  components/
    ui/
      Button.tsx           # Componente
      Button.stories.tsx   # Historias del componente
      Input.tsx
      Input.stories.tsx
      Card.tsx
      Card.stories.tsx
```

## ✍️ Crear una nueva historia

1. Crea tu componente en `src/components/ui/`
2. Crea un archivo `.stories.tsx` junto al componente:

```typescript
import React from 'react';
import { View } from 'react-native';
import { MiComponente } from './MiComponente';

export default {
  title: 'UI/MiComponente',
  component: MiComponente,
};

export const Default = () => <MiComponente />;
export const Variant = () => <MiComponente variant="special" />;
```

3. Ejecuta `npm run update-stories`
4. Reinicia la app para ver los cambios

## 🎨 Componentes disponibles

### Button
- Variantes: primary, secondary, outline, ghost
- Tamaños: small, medium, large
- Estados: disabled, loading

### Input
- Variantes: default, filled, outline
- Tamaños: small, medium, large
- Con label, error, helper text, iconos

### Card
- Variantes: elevated, outlined, filled
- Padding: none, small, medium, large
- Pressable opcional

## 📚 Recursos

- [Documentación de Storybook React Native](https://storybook.js.org/docs/react-native)
- [Addons para React Native](https://github.com/storybookjs/react-native)

