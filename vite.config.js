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
      port: 8080,
      open: true
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets'
    }
  }
})

