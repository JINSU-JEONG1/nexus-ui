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
