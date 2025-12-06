const { defineConfig, loadEnv } = require('vite')
const { createVuePlugin } = require('vite-plugin-vue2')
const { resolve } = require('path')

module.exports = defineConfig(({ mode }) => {
  // 현재 모드(development/production)에 맞는 환경 변수 로드
  const env = loadEnv(mode, process.cwd(), '')
  
  // process.env로 접근 가능하도록 define 설정
  const processEnv = {}
  Object.keys(env).forEach(key => {
    if (key.startsWith('VITE_')) {
      processEnv[key] = JSON.stringify(env[key])
    }
  })
  // BASE_URL은 문자열 리터럴로 직접 설정 (JSON.stringify 사용 시 이중 따옴표 문제 발생)
  processEnv.BASE_URL = `"${env.BASE_URL || '/'}"`

  return {
    plugins: [createVuePlugin()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@axios': resolve(__dirname, 'src/utils/request.js')
      }
    },
    // 환경 변수를 process.env로 사용할 수 있도록 정의
    define: {
      'process.env': processEnv
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

