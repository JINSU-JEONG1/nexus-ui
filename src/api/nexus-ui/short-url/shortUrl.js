import request from '@/utils/request';

/**
 * Short URL API 모듈
 * 백엔드의 Short URL 관련 API 호출 함수들
 */

// Short URL 생성
export function createShortUrl(data) {
    return request({
        url: '/short-url/create',
        method: 'post',
        data,
    });
}

// Short URL 목록 조회
export function getShortUrls(data) {
    return request({
        url: '/short-url',
        method: 'get',
        data,
    });
}

// 특정 Short URL 조회
export function getShortUrlById(id) {
    return request({
        url: `/short-url/${id}`,
        method: 'get',
    });
}


// ============================================
// 통계 대시보드 API
// ============================================

/**
 * KPI 데이터 조회
 */
export function getKpiData(data) {
    return request({
        url: `/short-url/stats/kpi`,
        method: 'post',
        data,
    });
}

/**
 * 추이 차트 데이터 조회
 */
export function getTrendData(period = 'week') {
    return request({
        url: '/short-url/stats/trend',
        method: 'get',
        params: { period },
    });
}

/**
 * 링크 점유율 데이터 조회 (Treemap용)
 */
export function getUsageData(limit = 100) {
    return request({
        url: '/short-url/stats/usage',
        method: 'get',
        params: { limit },
    });
}

/**
 * 전체 통계 데이터 일괄 조회
 */
export function getAllStatistics(period = 'week') {
    return request({
        url: '/short-url/stats/all',
        method: 'get',
        params: { period },
    });
}
