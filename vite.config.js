const { defineConfig, loadEnv } = require('vite')
const { createVuePlugin } = require('vite-plugin-vue2')
const { resolve } = require('path')

module.exports = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [createVuePlugin()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@axios': resolve(__dirname, 'src/utils/request.js')
      }
    },
    define: {
      'process.env': env
    },
    server: {
      port: env.VITE_APP_PORT,
      proxy: {
        '/api': {
target: mode === 'development' ? 'http://nexus-backend:4000' : 'http://localhost:4000',          changeOrigin: true,
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets'
    }
  }
})

