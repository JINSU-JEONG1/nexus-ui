import apiClient from './index'

// 사용자 관련 API
export const userApi = {
  // 사용자 목록 조회
  getUsers() {
    return apiClient.get('/users')
  },

  // 사용자 상세 조회
  getUserById(id) {
    return apiClient.get(`/users/${id}`)
  },

  // 사용자 생성
  createUser(userData) {
    return apiClient.post('/users', userData)
  },

  // 사용자 수정
  updateUser(id, userData) {
    return apiClient.put(`/users/${id}`, userData)
  },

  // 사용자 삭제
  deleteUser(id) {
    return apiClient.delete(`/users/${id}`)
  }
}

