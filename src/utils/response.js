import useJwt from '@/auth/jwt/useJwt'
import store from '@/store';
import router from '@/router';

const service = useJwt;

// Response Interceptor 설정
service.axiosIns.interceptors.response.use(
    // 성공 응답 처리
    (response) => {
        // TODO: 성공 응답 처리 로직
        // - 응답 데이터 변환
        // - 로깅
        // - 로딩 상태 해제
        
        return response;
    },
    // 에러 응답 처리
    (error) => {
        // TODO: 에러 응답 처리 로직
        // - 401: 토큰 만료/인증 실패 처리
        // - 403: 권한 없음 처리
        // - 500: 서버 에러 처리
        // - 네트워크 에러 처리
        // - 에러 메시지 표시
        // - 로그아웃 처리
        
        return Promise.reject(error);
    }
);

export default service.axiosIns;

