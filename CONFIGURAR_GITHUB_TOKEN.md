# 🔐 Configurar Token de GitHub

## Problema

El push falla porque GitHub ya no acepta contraseñas normales. Necesitas un **Personal Access Token**.

## 📝 Pasos Rápidos

### 1. Crear Token en GitHub

1. Ve a: https://github.com/settings/tokens
2. Haz clic en **"Generate new token"** → **"Generate new token (classic)"**
3. **Nombra el token:** "Clarita App"
4. **Selecciona permisos:**
   - ✅ `repo` (todo)
5. Haz clic en **"Generate token"**
6. **COpia el token** (solo lo verás una vez, úsalo ahora)

### 2. Guardar Token en Windows

```powershell
# En PowerShell, ejecuta:
git config --global credential.helper wincred
```

### 3. Hacer Push de Nuevo

```powershell
git push origin master
```

Cuando te pida credenciales:
- **Username:** tu usuario de GitHub
- **Password:** Pega el token (NO tu contraseña)

---

## ✅ Alternativa Rápida (Más Simple)

Puedes hacer el push con VS Code o GitHub Desktop que ya tienen tu autenticación guardada.

**O usa SSH en vez de HTTPS:**
```powershell
git remote set-url origin git@github.com:illtauga/clarita.git
git push -u origin master
```

---

**¿Quieres que te guíe para crear el token ahora mismo?** 🔑

