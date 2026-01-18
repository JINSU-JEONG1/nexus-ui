import request from '@/utils/request';

/**
 * Short URL API 모듈
 * 백엔드의 Short URL 관련 API 호출 함수들
 */

// Short URL 생성
export function createShortUrl(data) {
    return request({
        url: '/short-url/create.api',
        method: 'post',
        data,
    });
}

// Short URL 목록 조회
export function getShortUrls(params) {
    return request({
        url: '/short-url',
        method: 'get',
        params,
    });
}

// 특정 Short URL 조회
export function getShortUrlById(id) {
    return request({
        url: `/short-url/${id}`,
        method: 'get',
    });
}

// Short URL 수정
export function updateShortUrl(id, data) {
    return request({
        url: `/short-url/${id}`,
        method: 'put',
        data,
    });
}

// Short URL 삭제
export function deleteShortUrl(id) {
    return request({
        url: `/short-url/${id}`,
        method: 'delete',
    });
}

// Short URL 통계 조회 (예시)
export function getShortUrlStats(id) {
    return request({
        url: `/short-url/${id}/stats`,
        method: 'get',
    });
}

// ============================================
// 통계 대시보드 API
// ============================================

/**
 * KPI 데이터 조회
 * @returns {Promise} KPI 데이터 (총 링크 수, 오늘 생성, 총 클릭수, 평균 클릭률)
 */
export function getKpiData() {
    return request({
        url: '/short-url/statistics/kpi',
        method: 'get',
    });
}

/**
 * 추이 차트 데이터 조회
 * @param {string} period - 기간 타입 ('day', 'week', 'month')
 * @returns {Promise} 차트 데이터 (labels, created, clicks)
 */
export function getTrendData(period = 'week') {
    return request({
        url: '/short-url/statistics/trend',
        method: 'get',
        params: { period },
    });
}

/**
 * 링크 점유율 데이터 조회 (Treemap용)
 * @param {number} limit - 조회할 링크 개수 (기본 10개)
 * @returns {Promise} 점유율 데이터 배열
 */
export function getUsageData(limit = 10) {
    return request({
        url: '/short-url/statistics/usage',
        method: 'get',
        params: { limit },
    });
}

/**
 * 전체 통계 데이터 일괄 조회
 * @param {string} period - 기간 타입
 * @returns {Promise} KPI + 추이 + 점유율 데이터
 */
export function getAllStatistics(period = 'week') {
    return request({
        url: '/short-url/statistics/all',
        method: 'get',
        params: { period },
    });
}
