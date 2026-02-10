<template>
  <div class="home-page">
    <div class="page-header fade-in">
      <h1 class="page-title">Nexus Hub</h1>
      <p class="page-subtitle">다양한 스마트 도구들을 한곳에서 경험해보세요.</p>
    </div>

    <div class="row g-4 slide-up delay-1">
      <div class="col-lg-4">
        <router-link :to="{ name: 'short-url' }" class="router-link">
          <ProjectCard
            title="Short URL"
            description="긴 URL을 짧고 간단한 링크로 변환하세요"
          >
            <template #icon>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 3L4 14H12L11 21L20 10H12L13 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </template>
          </ProjectCard>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script setup>
import ProjectCard from '@/components/common/ProjectCard.vue'
</script>

<style scoped>


/* Home Page */
.home-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 24px;
}

.page-header {
  margin-bottom: 60px;
  text-align: center;
  animation: fadeIn 0.8s ease-out;
}

.page-title {
  font-size: 38px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 16px 0;
  letter-spacing: -1px;
  background-clip: text;
  background: linear-gradient(135deg, #1d1d1f 0%, #4a4a4a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  font-size: 17px;
  line-height: 1.4;
  color: var(--color-text-secondary);
  margin: 0;
  font-weight: 400;
}


</style>
