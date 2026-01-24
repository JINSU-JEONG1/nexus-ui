<template>
  <aside 
    class="sidebar" 
    :class="{ 'sidebar-collapsed': !isOpen }"
  >
    <div class="sidebar-content" v-show="isOpen">
      <div class="sidebar-section">
        <h2 class="sidebar-title">메뉴</h2>
        <nav class="sidebar-nav">
          <router-link class="nav-item" :to="{ name: 'home' }" exact-active-class="active">
            <span class="nav-icon">📊</span>
            <span class="nav-text">HOME</span>
          </router-link>
          <router-link class="nav-item" :to="{ name: 'short-url' }" exact-active-class="active">
            <span class="nav-icon">🔗</span>
            <span class="nav-text">Short URL</span>
          </router-link>
          <router-link class="nav-item" :to="{ name: 'short-url-statistics' }" exact-active-class="active">
            <span class="nav-icon">🔗</span>
            <span class="nav-text">Short URL 통계</span>
          </router-link>
          <!-- <a class="nav-item" href="#" @click.prevent>
            <span class="nav-icon">⚙️</span>
            <span class="nav-text">설정</span>
          </a> -->
          <!-- <a class="nav-item" href="#" @click.prevent>
            <span class="nav-icon">👤</span>
            <span class="nav-text">프로필</span>
          </a> -->
          <!-- <a class="nav-item" href="#" @click.prevent>
            <span class="nav-icon">❓</span>
            <span class="nav-text">도움말</span>
          </a> -->
          <!-- <router-link class="nav-item" :to="{ name: 'error-404' }" active-class="active">
            <span class="nav-icon">⚠️</span>
            <span class="nav-text">에러 페이지</span>
          </router-link>  -->
        </nav>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'NavSidebar',
  props: {
    isOpen: {
      type: Boolean,
      default: true
    }
  }
}
</script>


