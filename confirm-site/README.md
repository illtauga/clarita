# Sitio de Confirmación de Email - Clarita

Este directorio contiene una página HTML estática para confirmar el registro de usuarios vía email.

## ⚙️ Configuración

### 1. Editar las Credenciales

Abrí el archivo `index.html` y buscá estas líneas (aproximadamente línea 55-56):

```javascript
const SUPABASE_URL = 'TU_SUPABASE_URL_AQUI';
const SUPABASE_ANON_KEY = 'TU_SUPABASE_ANON_KEY_AQUI';
```

Reemplazá los valores con las credenciales de tu proyecto de Supabase:

1. Ve a tu dashboard de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **API**
4. Copia:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`

### 2. Subir a un Hosting

Este sitio debe estar hospedado públicamente para que Supabase pueda redirigir a los usuarios después de hacer clic en el link de confirmación.

#### Opciones de Hosting Gratuito:

##### Opción A: Netlify (Recomendado)
1. Crea una cuenta en https://netlify.com
2. Arrastra la carpeta `confirm-site` al dashboard de Netlify
3. Tu sitio estará en una URL como: `https://tu-sitio.netlify.app`

##### Opción B: Vercel
1. Crea una cuenta en https://vercel.com
2. Instala Vercel CLI: `npm install -g vercel`
3. Navega a la carpeta: `cd confirm-site`
4. Ejecuta: `vercel`
5. Sigue las instrucciones

##### Opción C: GitHub Pages
1. Sube esta carpeta a un repositorio de GitHub
2. Ve a Settings → Pages
3. Selecciona la branch y carpeta
4. Tu sitio estará en: `https://tu-usuario.github.io/tu-repo/`

### 3. Configurar la URL en Supabase

Una vez que tengas tu sitio hospedado:

1. Ve a tu dashboard de Supabase
2. Ve a **Authentication** → **URL Configuration**
3. Agrega tu URL del sitio de confirmación a la lista de **Redirect URLs**
   - Ejemplo: `https://tu-sitio.netlify.app/*`
4. Guarda los cambios

### 4. Actualizar la App

En tu archivo `.env` de la aplicación móvil, actualizá:

```env
AUTH_EMAIL_REDIRECT_URL=https://tu-sitio.netlify.app/?autoredirect=1
```

El parámetro `?autoredirect=1` hace que la página redirija automáticamente a la app después de confirmar.

## 🔧 Personalización

### Cambiar el Logo

Reemplazá el archivo `assets/logo.svg` con tu propio logo.

### Cambiar los Colores

Editá las variables CSS en la etiqueta `<style>` del `index.html`:

```css
:root {
  --clr-primary: #4F378A; /* Color principal de Clarita */
  --clr-primary-100: #E9D5FF; /* Color claro */
}
```

### Cambiar los Textos

Los textos están en español argentino. Podés editarlos directamente en el HTML.

## 🧪 Probar Localmente

Para probar el sitio localmente:

```bash
# Opción 1: Con Python
cd confirm-site
python -m http.server 8000

# Opción 2: Con Node.js
npx http-server -p 8000

# Luego abrí: http://localhost:8000
```

**Nota:** Al probar localmente, la confirmación no funcionará correctamente porque Supabase necesita redirigir a una URL pública.

## 📝 Notas de Seguridad

- La **anon key** es pública y está OK exponerla en el frontend
- **NUNCA** uses la `service_role` key en el frontend
- Este sitio solo maneja confirmación de email, no datos sensibles

## ❓ Troubleshooting

### "Error de configuración"
- Verificá que hayas reemplazado `TU_SUPABASE_URL_AQUI` y `TU_SUPABASE_ANON_KEY_AQUI` con valores reales

### "No pudimos confirmar el correo"
- Verificá que la URL del sitio esté en la lista de Redirect URLs de Supabase
- Verificá que el link del email no haya expirado (24 horas de validez)

### "El link no funciona"
- Asegurate de que el sitio esté accesible públicamente
- Probá abriendo la URL directamente en un navegador

## 🔗 Flujo Completo

1. Usuario se registra en la app
2. Supabase envía un email con un link de confirmación
3. El link redirige a este sitio
4. El sitio confirma el email automáticamente
5. El sitio redirige de vuelta a la app (si `autoredirect=1`)

---

**Importante:** Este sitio debe estar configurado ANTES de que los usuarios empiecen a registrarse.


