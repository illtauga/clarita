# Componentes de Interfaz - Clarita

## Tipografía

### Fuentes
La aplicación utiliza las siguientes fuentes de Google Fonts:

1. **Regular (400)**
   - Uso: Texto normal, párrafos, descripciones
   - Variantes: `bodyMedium`, `bodyLarge`
   - Ejemplo: Descripciones de eventos, mensajes informativos
   - Nombre de la fuente: `Poppins-Regular`

2. **Medium (500)**
   - Uso: Subtítulos, textos destacados, botones
   - Variantes: `titleMedium`, `labelMedium`, `buttonMedium`
   - Ejemplo: Etiquetas de campos, subtítulos de secciones, texto de botones
   - Nombre de la fuente: `Poppins-Medium`

3. **SemiBold (600)**
   - Uso: Subtítulos importantes
   - Variantes: `titleLarge`
   - Ejemplo: Encabezados de secciones, títulos secundarios
   - Nombre de la fuente: `Poppins-SemiBold`

4. **Bold (700)**
   - Uso: Títulos, encabezados, acciones importantes
   - Variantes: `headlineMedium`
   - Ejemplo: Títulos de pantallas, nombres de eventos
   - Nombre de la fuente: `Poppins-Bold`

### Nombres de Fuentes en React Native
Para usar estas fuentes directamente en React Native (sin Paper), los nombres son:

```typescript
const fontFamily = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
};
```

### Ejemplo de Uso Directo
```typescript
<Text style={{
  fontFamily: fontFamily.bold,
  fontSize: 24,
}}>
  Título en Poppins-Bold
</Text>

<Text style={{
  fontFamily: fontFamily.medium,
  fontSize: 16,
}}>
  Subtítulo en Poppins-Medium
</Text>

<Text style={{
  fontFamily: fontFamily.regular,
  fontSize: 14,
}}>
  Texto normal en Poppins-Regular
</Text>
```

### Paleta de Colores

#### Colores de Texto
```typescript
const textColors = {
  primary: '#000000',    // Negro para texto principal
  secondary: '#666666',  // Gris medio para texto secundario
  disabled: '#999999',   // Gris claro para texto deshabilitado
  error: '#B00020',      // Rojo para mensajes de error
  success: '#4CAF50',    // Verde para mensajes de éxito
  info: '#2196F3',       // Azul para mensajes informativos
};
```

### Ejemplo de Uso de Colores
```typescript
// Texto principal
<Text style={{
  color: textColors.primary,
  fontFamily: fontFamily.regular,
}}>
  Texto normal
</Text>

// Texto secundario
<Text style={{
  color: textColors.secondary,
  fontFamily: fontFamily.medium,
}}>
  Texto secundario
</Text>

// Botón principal
<Button
  mode="contained"
  buttonColor={buttonColors.primary}
  textColor="#FFFFFF"
  labelStyle={typography.buttonLarge}
>
  Botón Principal
</Button>

// Botón secundario
<Button
  mode="outlined"
  textColor={buttonColors.secondary}
  style={{ borderColor: buttonColors.secondary }}
  labelStyle={typography.buttonLarge}
>
  Botón Secundario
</Button>
```

### Estilos de Texto

#### Títulos Principales
```typescript
<Text variant="headlineMedium" style={styles.title}>
  Título Principal
</Text>
```

##### Propiedades de Estilo
```typescript
title: {
  ...typography.headlineMedium,
  textAlign: 'left',
  marginBottom: 30,
}
```

#### Subtítulos
```typescript
<Text variant="titleMedium" style={styles.subtitle}>
  Subtítulo
</Text>
```

##### Propiedades de Estilo
```typescript
subtitle: {
  ...typography.titleMedium,
  textAlign: 'center',
  marginBottom: 20,
  opacity: 0.7,
}
```

#### Texto de Cuerpo
```typescript
<Text variant="bodyMedium" style={styles.bodyText}>
  Texto de cuerpo
</Text>
```

##### Propiedades de Estilo
```typescript
bodyText: {
  ...typography.bodyMedium,
  textAlign: 'left',
}
```

#### Texto de Ayuda
```typescript
<HelperText type="info" style={styles.helperText}>
  Texto de ayuda
</HelperText>
```

##### Propiedades de Estilo
```typescript
helperText: {
  ...typography.labelMedium,
  marginTop: -10,
  marginBottom: 10,
}
```

### Jerarquía Tipográfica

1. **Nivel 1 - Headline**
   - Variante: `headlineMedium`
   - Uso: Títulos principales de pantallas
   - Tamaño: 24px
   - Peso: Bold (700)
   - Color: `#000000` (Negro)

2. **Nivel 2 - Title**
   - Variante: `titleLarge`
   - Uso: Subtítulos importantes
   - Tamaño: 20px
   - Peso: SemiBold (600)
   - Color: `#000000` (Negro)

3. **Nivel 3 - Subtitle**
   - Variante: `titleMedium`
   - Uso: Subtítulos secundarios
   - Tamaño: 16px
   - Peso: Medium (500)
   - Color: `#666666` (Gris medio)

4. **Nivel 4 - Body**
   - Variante: `bodyLarge`
   - Uso: Texto principal
   - Tamaño: 16px
   - Peso: Regular (400)
   - Color: `#000000` (Negro)

5. **Nivel 5 - Caption**
   - Variante: `bodyMedium`
   - Uso: Texto secundario, notas
   - Tamaño: 14px
   - Peso: Regular (400)
   - Color: `#666666` (Gris medio)

### Ejemplo de Implementación
```typescript
<View style={styles.container}>
  <Text variant="headlineMedium" style={styles.title}>
    Título Principal
  </Text>
  
  <Text variant="titleLarge" style={styles.subtitle}>
    Subtítulo Importante
  </Text>
  
  <Text variant="bodyLarge" style={styles.bodyText}>
    Este es un párrafo de texto principal que explica la funcionalidad
    o proporciona información importante al usuario.
  </Text>
  
  <HelperText type="info" style={styles.helperText}>
    Este es un texto de ayuda que proporciona información adicional
  </HelperText>
</View>
```

## Botones

### 1. Botón Principal (Contained)
El botón principal se utiliza para acciones primarias y destacadas.

```typescript
<Button
  mode="contained"
  onPress={handleAction}
  style={[buttonStyles.button, buttonStyles.primary, buttonStyles.contained]}
  contentStyle={buttonStyles.content}
  labelStyle={buttonStyles.primaryText}
>
  Texto del Botón
</Button>
```

#### Propiedades de Estilo
```typescript
button: {
  marginBottom: 15,
  width: '100%',
  height: 48,
  borderRadius: 10,
  justifyContent: 'center',
  overflow: 'hidden',
},
primary: {
  backgroundColor: MD3LightTheme.colors.primary,
  elevation: 2,
},
primaryText: {
  color: MD3LightTheme.colors.onPrimary,
  ...typography.buttonLarge,
},
content: {
  height: 48,
}
```

#### Características Visuales
- Color de fondo: Color primario del tema
- Color de texto: Color onPrimary del tema
- Fuente: Poppins-Medium (buttonLarge)
- Tamaño de texto: 16px
- Bordes redondeados: 10px
- Altura: 48px
- Ancho: 100% del contenedor
- Margen inferior: 15px
- Elevación: 2

### 2. Botón Secundario (Outlined)
El botón secundario se utiliza para acciones alternativas o menos importantes.

```typescript
<Button
  mode="outlined"
  onPress={handleAction}
  style={[buttonStyles.button, buttonStyles.secondary, buttonStyles.outlined]}
  contentStyle={buttonStyles.content}
  labelStyle={buttonStyles.secondaryText}
>
  Texto del Botón
</Button>
```

#### Propiedades de Estilo
```typescript
secondary: {
  borderColor: MD3LightTheme.colors.primary,
  borderWidth: 1,
  backgroundColor: 'transparent',
  borderRadius: 10,
  elevation: 0,
},
secondaryText: {
  color: MD3LightTheme.colors.primary,
  ...typography.buttonLarge,
}
```

#### Características Visuales
- Color de borde: Color primario del tema
- Color de texto: Color primario del tema
- Fuente: Poppins-Medium (buttonLarge)
- Tamaño de texto: 16px
- Fondo: Transparente
- Bordes redondeados: 10px
- Altura: 48px
- Ancho: 100% del contenedor
- Margen inferior: 15px
- Elevación: 0

### 3. Botón de Texto (Text)
El botón de texto se utiliza para acciones terciarias o enlaces.

```typescript
<Button 
  mode="text" 
  onPress={handleAction}
  style={[buttonStyles.button, buttonStyles.tertiary, buttonStyles.textMode]}
  contentStyle={buttonStyles.content}
  labelStyle={buttonStyles.tertiaryText}
>
  Texto del Botón
</Button>
```

#### Propiedades de Estilo
```typescript
tertiary: {
  backgroundColor: 'transparent',
  elevation: 0,
},
tertiaryText: {
  color: MD3LightTheme.colors.primary,
  ...typography.buttonLarge,
},
textMode: {
  borderRadius: 10,
  overflow: 'hidden',
}
```

#### Características Visuales
- Color de texto: Color primario del tema
- Fuente: Poppins-Medium (buttonLarge)
- Tamaño de texto: 16px
- Fondo: Transparente
- Bordes redondeados: 10px
- Altura: 48px
- Ancho: 100% del contenedor
- Margen inferior: 15px
- Elevación: 0

## Contenedores de Botones

### Contenedor Principal
```typescript
container: {
  width: '100%',
  marginBottom: 40,
}
```

## Uso Recomendado
1. **Botón Contained**: Para acciones principales como "Iniciar Sesión", "Registrarse", "Crear Evento"
2. **Botón Outlined**: Para acciones secundarias como "Cerrar Sesión", "Cancelar"
3. **Botón Text**: Para enlaces o acciones terciarias como "¿No tienes una cuenta? Regístrate"

## Ejemplo de Implementación
```typescript
<View style={[buttonStyles.container, styles.buttonContainer]}>
  <Button
    mode="contained"
    onPress={handlePrimaryAction}
    style={[buttonStyles.button, buttonStyles.primary, buttonStyles.contained]}
    contentStyle={buttonStyles.content}
    labelStyle={buttonStyles.primaryText}
  >
    Acción Principal
  </Button>

  <Button
    mode="outlined"
    onPress={handleSecondaryAction}
    style={[buttonStyles.button, buttonStyles.secondary, buttonStyles.outlined]}
    contentStyle={buttonStyles.content}
    labelStyle={buttonStyles.secondaryText}
  >
    Acción Secundaria
  </Button>

  <Button 
    mode="text" 
    onPress={handleTertiaryAction}
    style={[buttonStyles.button, buttonStyles.tertiary, buttonStyles.textMode]}
    contentStyle={buttonStyles.content}
    labelStyle={buttonStyles.tertiaryText}
  >
    Acción Terciaria
  </Button>
</View>
```

## Contenedores

### SafeAreaView
Se utiliza para respetar el área de resguardo en dispositivos iOS y Android.

```typescript
<SafeAreaView style={styles.container}>
  {/* Contenido */}
</SafeAreaView>
```

## Uso Recomendado
1. **Botón Contained**: Para acciones principales como "Iniciar Sesión", "Registrarse", "Crear Evento"
2. **Botón Outlined**: Para acciones secundarias como "Cerrar Sesión", "Cancelar"
3. **Botón Text**: Para enlaces o acciones terciarias como "¿No tienes una cuenta? Regístrate"
4. **SafeAreaView**: En todas las pantallas que tengan elementos cerca del borde superior
5. **Tipografía**: 
   - `headlineMedium` para títulos principales (alineado a la izquierda en pantallas de autenticación)
   - `titleMedium` para subtítulos
   - `bodyMedium` para texto normal
   - `buttonLarge` para texto de botones

## Headers

### Header de Navegación (Back Header)
Se utiliza en pantallas de autenticación y formularios para proporcionar navegación hacia atrás.

```typescript
<View style={styles.header}>
  <IconButton
    icon="arrow-left"
    size={24}
    onPress={() => router.back()}
  />
</View>
```

#### Propiedades de Estilo
```typescript
header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#F0F0F0',
}
```

#### Características Visuales
- Altura: 48px (12px padding vertical * 2 + 24px icono)
- Padding horizontal: 16px
- Borde inferior: 1px, color #F0F0F0
- Icono: arrow-left, tamaño 24px
- Alineación: Centrado verticalmente

### Header de Aplicación (App Header)
Se utiliza en la pantalla principal de eventos para mostrar el logo y acciones de usuario.

```typescript
<View style={styles.header}>
  <View style={styles.logoContainer}>
    <Logo width={120} height={48} />
  </View>
  <View style={styles.headerActions}>
    {!user && (
      <Button
        mode="text"
        onPress={() => router.push('/(auth)/welcome')}
        style={styles.loginButton}
      >
        Iniciar Sesión
      </Button>
    )}
    {user && (
      <IconButton
        icon="account-circle-outline"
        size={28}
        onPress={() => router.push('/(app)/profile')}
      />
    )}
  </View>
</View>
```

#### Propiedades de Estilo
```typescript
header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#F0F0F0',
},
logoContainer: {
  alignItems: 'center',
  justifyContent: 'center',
},
headerActions: {
  flexDirection: 'row',
  alignItems: 'center',
},
loginButton: {
  marginRight: 8,
}
```

#### Características Visuales
- Altura: 48px (12px padding vertical * 2 + 24px logo)
- Padding horizontal: 16px
- Borde inferior: 1px, color #F0F0F0
- Logo: 120px ancho, 48px alto
- Botón de login: Margen derecho 8px
- Icono de perfil: 28px

## Uso Recomendado
1. **Header de Navegación**: 
   - En pantallas de autenticación (login, registro, recuperación de contraseña)
   - En pantallas de formularios
   - En pantallas que requieren navegación hacia atrás

2. **Header de Aplicación**:
   - En la pantalla principal de eventos
   - En pantallas que requieren mostrar el logo y acciones de usuario
   - En pantallas que necesitan diferenciar entre usuarios registrados e invitados
</rewritten_file>