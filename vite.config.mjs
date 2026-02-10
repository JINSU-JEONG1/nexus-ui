import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@axios': path.resolve(__dirname, 'src/utils/request.js')
      }
    },
    server: {
      port: parseInt(env.VITE_APP_PORT) || 3000,
      proxy: {
        '/api': {
          target: env.VITE_API_TARGET,
          changeOrigin: true,
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets'
    }
  }
})
