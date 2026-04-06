import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
// https://vite.dev/config/#using-environment-variables-in-config
export default defineConfig(({ mode }) => 
  {
    const env = loadEnv(mode, process.cwd(), '')

    // read variables after loadEnv.
    // To switch from one to another user vite --mode 
    // "dev": "vite". Normal run .env, env.*
    // "example": "vite --mode example". Force .env.example env file

    const v_host = env.VITE_HOST || 'localhost';
    const v_port = Number(env.VITE_PORT) || 5173;

    return {
      plugins: [react()],
      define: 
      {
        // Provide an explicit app-level constant derived from an env var.
        __APP_ENV__: JSON.stringify(env.APP_ENV),
      },

      // Example: use an env var to set the dev server port conditionally.
      server: 
      {
        host: v_host ? v_host : 'localhost',
        port: v_port ? Number(v_port) : 5173,
      },
    }
  }
)


