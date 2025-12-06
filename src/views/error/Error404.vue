<template>
  <div class="error-404 d-flex align-items-center justify-content-center vh-100">
    <div class="text-center">
      <h1 class="display-1 fw-bold text-primary">404</h1>
      <h2 class="mb-3">페이지를 찾을 수 없습니다</h2>
      <p class="text-muted mb-4">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
      <button class="btn btn-primary" @click="goHome">
        홈으로 돌아가기
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error404',
  methods: {
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.error-404 {
  background-color: #f8f9fa;
}
</style>