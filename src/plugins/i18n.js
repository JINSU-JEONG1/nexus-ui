// 다국어 플러그인 설정 예시
export default {
  install(app, options = {}) {
    const messages = {
      ko: {
        hello: '안녕하세요',
        welcome: '환영합니다'
      },
      en: {
        hello: 'Hello',
        welcome: 'Welcome'
      }
    }

    let currentLang = options.defaultLang || 'ko'

    app.config.globalProperties.$t = (key) => {
      return messages[currentLang]?.[key] || key
    }

    app.config.globalProperties.$setLang = (lang) => {
      if (messages[lang]) {
        currentLang = lang
      }
    }
  }
}

