# Guía de Configuración - Clarita

## 1. Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Supabase Configuration
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-clave-anonima-aqui

# Auth Redirect URLs
AUTH_EMAIL_REDIRECT_URL=clarita://auth-redirect
RESET_PASSWORD_REDIRECT_URL=clarita://reset-password
```

### ¿Dónde obtener las credenciales de Supabase?

1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión o crea una cuenta
3. Crea un nuevo proyecto o selecciona uno existente
4. Ve a **Settings** → **API**
5. Copia:
   - **URL**: Campo "Project URL"
   - **ANON_KEY**: Campo "anon public"

## 2. Configuración de la Base de Datos

Ejecuta el siguiente script SQL en tu consola de Supabase:

### 2.1. Tabla de Usuarios Extendida

```sql
-- Tabla de usuarios extendida (complementa auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsqueda rápida por username
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);

-- RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view usernames for mentions" ON public.users
  FOR SELECT USING (true);
```

### 2.2. Tabla de Eventos

```sql
-- Tabla de eventos
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  total_cost DECIMAL(10, 2),
  is_local BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);

-- RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view their own events" ON public.events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events" ON public.events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events" ON public.events
  FOR DELETE USING (auth.uid() = user_id);
```

### 2.3. Tabla de Participantes

```sql
-- Tabla de participantes
CREATE TABLE IF NOT EXISTS public.participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_participants_event_id ON public.participants(event_id);

-- RLS
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view participants of their events" ON public.participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = participants.event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add participants to their events" ON public.participants
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = participants.event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update participants of their events" ON public.participants
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = participants.event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete participants of their events" ON public.participants
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = participants.event_id
      AND events.user_id = auth.uid()
    )
  );
```

### 2.4. Tabla de Aportes (Contributions)

```sql
-- Tabla de aportes
CREATE TABLE IF NOT EXISTS public.contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_contributions_participant_id ON public.contributions(participant_id);

-- RLS
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view contributions of their events" ON public.contributions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.participants
      INNER JOIN public.events ON events.id = participants.event_id
      WHERE participants.id = contributions.participant_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add contributions to their events" ON public.contributions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.participants
      INNER JOIN public.events ON events.id = participants.event_id
      WHERE participants.id = contributions.participant_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update contributions of their events" ON public.contributions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.participants
      INNER JOIN public.events ON events.id = participants.event_id
      WHERE participants.id = contributions.participant_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete contributions of their events" ON public.contributions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.participants
      INNER JOIN public.events ON events.id = participants.event_id
      WHERE participants.id = contributions.participant_id
      AND events.user_id = auth.uid()
    )
  );
```

### 2.5. Función RPC para obtener email por username

```sql
-- Función para obtener email por username (necesaria para login)
CREATE OR REPLACE FUNCTION get_email_by_username(p_username TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_email TEXT;
BEGIN
  -- Buscar user_id por username
  SELECT id INTO v_user_id
  FROM public.users
  WHERE username = p_username
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Obtener email de auth.users
  SELECT email INTO v_email
  FROM auth.users
  WHERE id = v_user_id;

  RETURN v_email;
END;
$$;
```

### 2.6. Trigger para crear usuario en public.users

```sql
-- Función que se ejecuta cuando se crea un usuario en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Trigger que se activa al crear un usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2.7. Función para actualizar timestamp

```sql
-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contributions_updated_at ON public.contributions;
CREATE TRIGGER update_contributions_updated_at
  BEFORE UPDATE ON public.contributions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 3. Verificar la Configuración

Después de ejecutar el script SQL, verifica que las tablas se crearon correctamente:

```sql
-- Ver todas las tablas
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Verificar RLS está habilitado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

## 4. Probar la Conexión

Una vez configurado todo, ejecuta:

```bash
npm start
```

Y verifica que la aplicación se conecta correctamente a Supabase.

## 5. Datos de Prueba (Opcional)

Para probar la aplicación, puedes insertar algunos datos de prueba después de registrar un usuario:

```sql
-- Reemplaza 'tu-user-id' con el ID de tu usuario
INSERT INTO public.events (user_id, title, description, date, total_cost)
VALUES 
  ('tu-user-id', 'Asado del viernes', 'Asado con amigos', '2025-10-25', 5000.00),
  ('tu-user-id', 'Cumpleaños de Ana', 'Celebración de cumpleaños', '2025-11-15', 3000.00);
```

## 6. Troubleshooting

### Error: "Invalid API key"
- Verifica que copiaste correctamente las credenciales de Supabase
- Asegúrate de usar la clave "anon public" y no la "service_role"

### Error: "Row Level Security"
- Asegúrate de haber ejecutado todas las políticas RLS
- Verifica que el usuario esté autenticado

### Error: "Cannot read property of undefined"
- Reinicia el servidor de desarrollo: `npm start --reset-cache`
- Verifica que el archivo `.env` esté en la raíz del proyecto


