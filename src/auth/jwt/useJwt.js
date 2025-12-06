import axios from 'axios'

/**
 * JWT 인증을 위한 axios 인스턴스 생성
 * @param {Object} axiosInstance - axios 인스턴스 (선택사항)
 * @param {Object} config - 설정 옵션
 * @returns {Object} jwt 객체 (axiosIns 포함)
 */
function useJwt(axiosInstance = null, config = {}) {
  // axios 인스턴스 생성 또는 기존 인스턴스 사용
  const axiosIns = axiosInstance || axios.create({
    baseURL: config.baseURL || process.env.VITE_API_BASE_URL || '',
    timeout: config.timeout || 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Request Interceptor: JWT 토큰을 헤더에 추가
  axiosIns.interceptors.request.use(
    (config) => {
      // localStorage 또는 sessionStorage에서 토큰 가져오기
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  return {
    axiosIns
  }
}

// jwt 객체 생성 및 export
const jwt = useJwt()
export default jwt
