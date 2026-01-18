<template>
  <div class="home-page">
    <div class="page-header">
      <h1 class="page-title">프로젝트</h1>
      <p class="page-subtitle">Nexus UI에서 제공하는 다양한 서비스를 이용해보세요</p>
    </div>

    <div class="projects-grid">
      <router-link 
        :to="{ name: 'short-url' }"
        class="project-card"
      >
        <div class="card-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 3L4 14H12L11 21L20 10H12L13 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="card-content">
          <h3 class="card-title">Short URL</h3>
          <p class="card-description">긴 URL을 짧고 간단한 링크로 변환하세요</p>
        </div>
        <div class="card-arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </router-link>
    </div>

  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

