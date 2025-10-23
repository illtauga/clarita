# Clarita – Documentación de Flujo y Funcionalidades

**Clarita** es una aplicación diseñada para simplificar la organización y división de gastos en eventos compartidos, como comidas entre amigos, viajes grupales o cualquier situación donde varias personas hacen aportes desiguales.

El objetivo principal de la app es permitir que un usuario registre un evento, cargue participantes, anote los aportes de cada uno (ya sea dinero o insumos), y obtenga automáticamente el cálculo de cuánto debe aportar o recibir cada integrante.

##  Pila tecnológica:

    - Frontend: React Native con TypeScript + Expo
    - Persistencia local: MMKV
    - Navegación: React Navigation con Stack y Bottom Tabs
    - Backend/Base de datos: Supabase (PostgreSQL, autenticación con email, RLS habilitado)
    - Marco de IU: React Native Paper
    - Monitoreo de errores (opcional): Sentry
    - Testing (opcional): Jest + React Native Testing Library


## 🧭 Flujo General de la App

1. **Pantalla de Bienvenida**
   - Muestra el logo y una breve descripción de la app.
   - Opción para registrarse o iniciar sesión (solo si se desea guardar eventos en la nube).
   - Posibilidad de continuar sin registrarse (modo local).

2. **Inicio / Panel Principal**
   - Lista de eventos creados por el usuario, ordenados por fecha.
   - Botón para crear un nuevo evento.

3. **Creación de Evento**
   - Nombre del evento (ej: "Asado viernes", "Cumple de Ana").
   - Fecha del evento (opcional).
   - Costo total del evento (opcional)
   - Cantidad de participantes y sus nombres.

4. **Carga de Aportes**
   - Por cada participante, se pueden ingresar múltiples aportes.
   - Cada aporte incluye:
     - Descripción (ej: "Carne", "Efectivo", "Cerveza").
     - Monto estimado (en valor monetario).
   - Posibilidad de editar o eliminar aportes antes del cálculo.

5. **Cálculo Automático**
   - La app suma todos los aportes.
   - Divide el total entre el número de participantes.
   - Calcula:
     - Cuánto aportó cada persona.
     - Cuánto debería haber aportado.
     - Diferencia (a favor o en contra).
     - Quién debe cuánto y a quién.

6. **Resumen y Resultados**
   - Vista clara del balance por persona.
   - Detalle de pagos sugeridos.
   - Opción para compartir el resumen por WhatsApp, email, etc.

## ⚙️ Funcionalidades Clave

- Registro opcional con email para sincronizar eventos entre dispositivos.
- Gestión de múltiples eventos independientes.
- Aportes en dinero e insumos (todo convertido a valor monetario).
- Algoritmo de balanceo automático simple y entendible.
- Interfaz clara, sin complicaciones.
- Generación de resumen final fácil de compartir.

## 🔐 Consideraciones

- La app no funciona como red social: no hay perfiles públicos ni búsqueda de usuarios.
- Todos los datos se mantienen en el dispositivo del usuario, salvo que este opte por registrarse para sincronización.

## 💡 Futuras Funcionalidades (Opcional)

- Conversión de moneda en aportes para eventos internacionales.
- Agregado de fotos o comprobantes de los aportes.
- Opciones de filtros y etiquetas para eventos.

## 📊 Esquema de la Base de Datos

```sql
-- Tabla de Usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Eventos
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    date DATE,
    total_cost DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Participantes
CREATE TABLE participants (
    id SERIAL PRIMARY KEY,
    event_id INT REFERENCES events(id),
    name VARCHAR(255) NOT NULL
);

-- Tabla de Aportes
CREATE TABLE contributions (
    id SERIAL PRIMARY KEY,
    participant_id INT REFERENCES participants(id),
    description VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📂 Estructura de Carpetas

```
/src
  /components
    - EventList.tsx
    - EventForm.tsx
    - ContributionForm.tsx
  /screens
    - WelcomeScreen.tsx
    - HomeScreen.tsx
    - EventScreen.tsx
  /navigation
    - AppNavigator.tsx
  /context
    - AuthContext.tsx
  /hooks
    - useAuth.ts
  /utils
    - api.ts
    - helpers.ts
  /assets
    /images
    /icons
  /styles
    - theme.ts
  /tests
    - EventForm.test.tsx
```
