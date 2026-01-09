<template>
  <header class="app-header">
    <div class="header-content">
      <!-- 메뉴 토글 버튼 -->
      <button 
        class="menu-toggle" 
        @click="$emit('toggle-sidebar')"
        type="button"
        :title="isSidebarOpen ? '사이드바 닫기' : '사이드바 열기'"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path 
            d="M4 6H16M4 10H16M4 14H16" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round"
          />
        </svg>
      </button>

      <!-- 로고 (아이콘 + 텍스트) -->
      <router-link :to="{ name: 'home' }" class="header-logo">
        <!-- Nexus 로고 아이콘 (연결된 노드 네트워크) -->
        <svg class="logo-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- 중앙 노드 -->
          <circle cx="16" cy="16" r="3" fill="url(#logo-gradient)"/>
          <!-- 주변 노드들 -->
          <circle cx="8" cy="8" r="2" fill="url(#logo-gradient)" opacity="0.8"/>
          <circle cx="24" cy="8" r="2" fill="url(#logo-gradient)" opacity="0.8"/>
          <circle cx="8" cy="24" r="2" fill="url(#logo-gradient)" opacity="0.8"/>
          <circle cx="24" cy="24" r="2" fill="url(#logo-gradient)" opacity="0.8"/>
          <!-- 연결선 -->
          <line x1="16" y1="16" x2="8" y2="8" stroke="url(#logo-gradient)" stroke-width="1.5" opacity="0.6"/>
          <line x1="16" y1="16" x2="24" y2="8" stroke="url(#logo-gradient)" stroke-width="1.5" opacity="0.6"/>
          <line x1="16" y1="16" x2="8" y2="24" stroke="url(#logo-gradient)" stroke-width="1.5" opacity="0.6"/>
          <line x1="16" y1="16" x2="24" y2="24" stroke="url(#logo-gradient)" stroke-width="1.5" opacity="0.6"/>
          <!-- 그라데이션 정의 -->
          <defs>
            <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#0071E3"/>
              <stop offset="100%" stop-color="#00A8FF"/>
            </linearGradient>
          </defs>
        </svg>
        <span class="logo-text">Nexus</span>
      </router-link>

      <!-- 빈 공간 -->
      <div class="header-spacer"></div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'NavHeader',
  props: {
    isSidebarOpen: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped>
/* 헤더 컨테이너 - 강화된 글래스모피즘 */
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.8); /* 더 진한 반투명 */
  backdrop-filter: saturate(180%) blur(30px); /* 블러 강화 */
  -webkit-backdrop-filter: saturate(180%) blur(30px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); /* 미세한 그림자 추가 */
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 24px;
  max-width: 100%;
  margin: 0 auto;
}

/* 메뉴 토글 버튼 */
.menu-toggle {
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #1d1d1f;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-toggle:hover {
  background: rgba(0, 0, 0, 0.06);
}

.menu-toggle:active {
  transform: scale(0.95);
}

/* 로고 컨테이너 */
.header-logo {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: opacity 0.2s ease;
  padding: 4px 0;
}

.header-logo:hover {
  opacity: 0.75;
}

/* 로고 아이콘 */
.logo-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

/* 로고 텍스트 */
.logo-text {
  font-size: 21px;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 빈 공간 */
.header-spacer {
  flex: 1;
}

/* 반응형 */
@media (max-width: 768px) {
  .header-content {
    padding: 12px 16px;
  }
  
  .logo-icon {
    width: 24px;
    height: 24px;
  }
  
  .logo-text {
    font-size: 18px;
  }
}
</style>
