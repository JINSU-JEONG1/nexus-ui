<template>
  <aside 
    class="sidebar" 
    :class="{ 'sidebar-collapsed': !isOpen }"
  >
    <div class="sidebar-content" v-show="isOpen">
      <div class="sidebar-section">
        <h2 class="sidebar-title">메뉴</h2>
        <nav class="sidebar-nav">
          <a class="nav-item active" href="#" @click.prevent>
            <span class="nav-icon">📊</span>
            <span class="nav-text">대시보드</span>
          </a>
          <a class="nav-item" href="#" @click.prevent>
            <span class="nav-icon">⚙️</span>
            <span class="nav-text">설정</span>
          </a>
          <a class="nav-item" href="#" @click.prevent>
            <span class="nav-icon">👤</span>
            <span class="nav-text">프로필</span>
          </a>
          <a class="nav-item" href="#" @click.prevent>
            <span class="nav-icon">❓</span>
            <span class="nav-text">도움말</span>
          </a>
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


