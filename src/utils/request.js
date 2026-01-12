import axios from 'axios';
import store from '@/store';

// Axios 인스턴스 생성 - 백엔드 API와 통신하기 위한 기본 설정
const service = axios.create({
    baseURL: process.env.VITE_API_BASE_API || '/api', // nginx에서 프록시된 경로
    timeout: 15000, // 요청 타임아웃 (15초)
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터 - 모든 요청 전에 실행
service.interceptors.request.use(
    config => {
        // 추후 JWT 토큰 추가 시 주석 해제:
        // const token = store.state.auth?.token || localStorage.getItem('accessToken');
        // if (token) {
        //   config.headers['Authorization'] = `Bearer ${token}`;
        // }

        // 요청 로깅 (개발 환경에서만)
        if (process.env.NODE_ENV === 'development') {
            console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
        }

        // 추가적인 파라미터 처리 (기존 로직 유지)
        // const logRouteChange = store.state.erns?.logRouteChange || {
        //     from: null,
        //     to: null
        // };
        // const currentLogRoute = logRouteChange.to || {};
        // const compid = "1200"; // TODO: 추후 법인코드 처리시 변경

        // // data에 공통 파라미터 추가
        // if (config.data) {
        //     config.data["compid"] = compid;
        //     config.data["routerName"] = currentLogRoute.name;
        // }

        return config;
    },
    error => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터 - 모든 응답 후에 실행
service.interceptors.response.use(
    response => {
        // 응답 로깅 (개발 환경에서만)
        if (process.env.NODE_ENV === 'development') {
            console.log('✅ Response:', response.config.url, response.status);
        }

        // 응답 데이터 반환
        return response.data;
    },
    error => {
        console.error('❌ Response error:', error.response?.status, error.message);

        // 에러 상태 코드별 처리
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 추후 JWT 추가 시 주석 해제:
                    // console.warn('Unauthorized - Token expired or invalid');
                    // store.dispatch('auth/logout'); // 로그아웃 처리
                    // window.location.href = '/login'; // 로그인 페이지로 리다이렉트
                    break;

                case 403:
                    console.warn('Forbidden - Access denied');
                    break;

                case 404:
                    console.warn('Not Found - Resource not found');
                    break;

                case 500:
                    console.error('Internal Server Error');
                    break;

                default:
                    console.error('Request failed with status:', error.response.status);
            }
        } else if (error.request) {
            // 요청은 보냈지만 응답을 받지 못한 경우
            console.error('No response received from server');
        } else {
            // 요청 설정 중 에러 발생
            console.error('Error setting up request:', error.message);
        }

        return Promise.reject(error);
    }
);

export default service;
