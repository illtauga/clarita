# Sistema de Diseño Clarita

## 📐 Introducción

Este documento describe el sistema de diseño de Clarita, incluyendo los componentes UI, patrones de diseño y guías de uso.

## 🎨 Paleta de Colores

```typescript
// src/theme/theme.ts
colors: {
  primary: '#4F378B',      // Púrpura principal
  secondary: '#F59E0B',    // Naranja/Amarillo
  background: '#FFFFFF',   // Fondo blanco
  surface: '#F9FAFB',      // Superficie gris claro
  text: '#1F2937',         // Texto principal
  textSecondary: '#6B7280',// Texto secundario
  border: '#E5E7EB',       // Bordes
  error: '#EF4444',        // Error rojo
  success: '#10B981',      // Éxito verde
  warning: '#F59E0B',      // Advertencia naranja
}
```

## 📝 Tipografía

### Familias de fuentes
- **Primaria:** Poppins (títulos, botones)
- **Secundaria:** Inter (texto del cuerpo)
- **Monoespaciada:** Roboto Mono (código, números)

### Tamaños
- **H1:** 32px / Bold
- **H2:** 24px / SemiBold
- **H3:** 20px / SemiBold
- **Body:** 16px / Regular
- **Caption:** 14px / Regular
- **Small:** 12px / Regular

## 🧩 Componentes

### Button

Componente de botón con múltiples variantes y tamaños.

**Props:**
- `title`: string - Texto del botón
- `onPress`: () => void - Callback al presionar
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' - Variante visual
- `size`: 'small' | 'medium' | 'large' - Tamaño del botón
- `disabled`: boolean - Si está deshabilitado
- `loading`: boolean - Muestra indicador de carga
- `fullWidth`: boolean - Ocupa todo el ancho disponible

**Uso:**
```tsx
import { Button } from '@/components/ui';

<Button 
  title="Continuar" 
  variant="primary"
  size="large"
  onPress={() => navigate('next')}
/>
```

**Variantes:**
- **Primary:** Botón principal con fondo de color primario
- **Secondary:** Botón secundario con fondo de color secundario
- **Outline:** Botón con borde, sin fondo
- **Ghost:** Botón sin fondo ni borde

### Input

Componente de entrada de texto con validación y estados.

**Props:**
- `label`: string - Etiqueta del campo
- `error`: string - Mensaje de error
- `helperText`: string - Texto de ayuda
- `leftIcon`: ReactNode - Icono a la izquierda
- `rightIcon`: ReactNode - Icono a la derecha
- `variant`: 'default' | 'filled' | 'outline' - Variante visual
- `size`: 'small' | 'medium' | 'large' - Tamaño del input
- `...TextInputProps` - Todas las props de TextInput

**Uso:**
```tsx
import { Input } from '@/components/ui';

<Input
  label="Email"
  placeholder="tu@email.com"
  variant="filled"
  keyboardType="email-address"
  error={errors.email}
  onChangeText={(text) => setEmail(text)}
/>
```

**Variantes:**
- **Default:** Input con borde inferior (underline)
- **Filled:** Input con fondo de color
- **Outline:** Input con borde completo

### Card

Contenedor para agrupar información relacionada.

**Props:**
- `children`: ReactNode - Contenido del card
- `variant`: 'elevated' | 'outlined' | 'filled' - Variante visual
- `padding`: 'none' | 'small' | 'medium' | 'large' - Padding interno
- `onPress`: () => void - Hace el card presionable
- `...TouchableOpacityProps` - Props de TouchableOpacity

**Uso:**
```tsx
import { Card } from '@/components/ui';

<Card variant="elevated" padding="medium">
  <Text>Contenido del card</Text>
</Card>
```

**Variantes:**
- **Elevated:** Card con sombra elevada
- **Outlined:** Card con borde
- **Filled:** Card con fondo de color

## 📏 Espaciado

Sistema de espaciado basado en múltiplos de 4:

```typescript
spacing: {
  xs: 4,    // 4px
  sm: 8,    // 8px
  md: 16,   // 16px
  lg: 24,   // 24px
  xl: 32,   // 32px
  xxl: 48,  // 48px
}
```

## 🎯 Bordes y Radios

```typescript
borderRadius: {
  sm: 4,    // Pequeño
  md: 8,    // Mediano
  lg: 12,   // Grande
  xl: 16,   // Extra grande
  full: 999 // Completamente redondeado
}
```

## 🌓 Sombras

```typescript
shadows: {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
}
```

## 🔧 Uso del Sistema de Diseño

### 1. Importar componentes

```tsx
import { Button, Input, Card } from '@/components/ui';
```

### 2. Usar el tema

```tsx
import { theme } from '@/theme/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
});
```

### 3. Desarrollar con Storybook

Para trabajar en componentes de forma aislada:

```bash
# Iniciar Storybook
npm run storybook

# Actualizar historias después de cambios
npm run update-stories
```

## 📱 Responsividad

### Breakpoints

```typescript
breakpoints: {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
}
```

### Uso

```tsx
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isMobile = width < 768;
const isTablet = width >= 768 && width < 1024;
```

## ✅ Mejores Prácticas

1. **Consistencia:** Usa siempre componentes del sistema de diseño
2. **Accesibilidad:** Incluye labels y hints apropiados
3. **Estados:** Maneja estados de loading, error y éxito
4. **Espaciado:** Usa el sistema de espaciado definido
5. **Colores:** Usa la paleta de colores del tema
6. **Tipografía:** Respeta la jerarquía tipográfica

## 🔄 Migración de Componentes Existentes

### Antes (sin sistema de diseño):

```tsx
<TouchableOpacity 
  style={{
    backgroundColor: '#4F378B',
    padding: 16,
    borderRadius: 12,
  }}
  onPress={handlePress}
>
  <Text style={{ color: 'white' }}>Continuar</Text>
</TouchableOpacity>
```

### Después (con sistema de diseño):

```tsx
<Button
  title="Continuar"
  variant="primary"
  size="medium"
  onPress={handlePress}
/>
```

## 📚 Recursos Adicionales

- [Guía de Storybook](./.storybook/README.md)
- [Documentación de componentes](../src/components/ui/)
- [Tema principal](../src/theme/theme.ts)

## 🤝 Contribuir

Al agregar nuevos componentes:

1. Crea el componente en `src/components/ui/`
2. Define props con TypeScript
3. Crea un archivo `.stories.tsx`
4. Documenta el uso en este documento
5. Ejecuta `npm run update-stories`
6. Haz commit de los cambios

---

**Última actualización:** Octubre 2025
**Versión:** 1.0.0

