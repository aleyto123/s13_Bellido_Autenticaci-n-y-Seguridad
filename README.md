# Laboratorio 13 — NextAuth con Google

Implementación del procedimiento de la guía hasta antes de TAREA. Incluye Google OAuth, sesiones, cierre de sesión, navegación, dashboard, perfil y protección de ambas rutas.

## Ejecutar

Abre una terminal nueva después de instalar Node.js (versión 20.9 o superior para Next.js actual), ubícate en esta carpeta y ejecuta:

```powershell
npm run dev
```

Abre http://localhost:3000. Si copias el proyecto a otra computadora, instala primero con `npm ci`.

## Credenciales de Google pendientes

El archivo `.env.local` contiene un NEXTAUTH_SECRET aleatorio generado localmente y NEXTAUTH_URL=http://localhost:3000. Completa GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET con tus propias credenciales. No se reutilizaron las credenciales de ejemplo de la guía.

En https://console.cloud.google.com/apis/credentials crea un proyecto y configura la pantalla de consentimiento OAuth. Si la aplicación está en pruebas, agrega tu correo como usuario de prueba. Crea un cliente OAuth de tipo Aplicación web con:

- Origen autorizado: `http://localhost:3000`
- URI de redirección: `http://localhost:3000/api/auth/callback/google`

Guarda las credenciales en `.env.local` y reinicia el servidor si ya estaba abierto. Nunca subas ese archivo al repositorio.

## Verificar al iniciar

1. Sin sesión, entrar a `/dashboard` o `/profile` debe llevar a `/signIn`.
2. Pulsar Continue with Google, autorizar el acceso y comprobar el nombre en Dashboard.
3. Abrir Profile y comprobar nombre, correo y foto.
4. Cerrar Sesión y comprobar que las rutas vuelven a requerir acceso.

## Ajustes de compatibilidad

- `src/proxy.ts` cumple la función del `middleware.ts` de la guía en Next.js 16.
- Las opciones de NextAuth se comparten desde `src/lib/auth.ts`, para que route.ts exporte solo los métodos HTTP admitidos.
- Las páginas con JSX usan `.tsx` y el acceso OAuth redirige a Google.
- Las imágenes de Google se habilitan mediante `remotePatterns`.
- Además de la protección en proxy, cada página privada valida la sesión en el servidor.

Se deja pendiente la sección TAREA: CredentialsProvider, registro, bloqueo de intentos, bcrypt y GitHub, así como capturas y despliegue.
