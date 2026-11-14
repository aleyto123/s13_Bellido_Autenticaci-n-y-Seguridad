# Laboratorio 13: Autenticación y Seguridad

**Curso:** Desarrollo de Aplicaciones Web Avanzado  
**Institución:** Tecsup

## Objetivo

Implementar un sistema de autenticación con Google mediante NextAuth.js en una aplicación Next.js, aplicando el flujo OAuth 2.0, el manejo de sesiones y la protección de rutas.

## Tecnologías utilizadas

- Next.js con App Router
- TypeScript
- NextAuth.js
- Google OAuth 2.0
- Tailwind CSS
- React Icons

## Funcionalidades

- Inicio de sesión con Google.
- Inicio de sesión con GitHub.
- Registro e inicio de sesión con correo y contraseña mediante CredentialsProvider.
- Almacenamiento de contraseñas mediante hash bcrypt con factor de trabajo 12.
- Bloqueo de la cuenta durante 15 minutos después de 5 intentos fallidos consecutivos.
- Gestión de sesiones de usuario.
- Dashboard con información del usuario autenticado.
- Perfil con nombre, correo electrónico e imagen.
- Protección de las rutas de dashboard y perfil.
- Cierre de sesión.

## Persistencia

Los usuarios y el estado de bloqueo se almacenan en una base de datos SQLite durante el desarrollo local. El despliegue en Vercel utiliza una base de datos remota compatible con libSQL, configurada mediante `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN`.

## Repositorio

[Código fuente del laboratorio](https://github.com/aleyto123/s13_Bellido_Autenticaci-n-y-Seguridad)

## Ejecución

```bash
npm install
npm run dev
```

La aplicación se ejecuta en `http://localhost:3000`.
