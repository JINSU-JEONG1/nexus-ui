<template>
  <header class="app-header">
    <div class="header-content">
      <button 
        class="menu-toggle" 
        @click="$emit('toggle-sidebar')"
        type="button"
        :title="isSidebarOpen ? '사이드바 닫기' : '사이드바 열기'"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path v-if="isSidebarOpen" d="M4 6L16 6M4 10L16 10M4 14L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path v-else d="M6 6L14 14M14 6L6 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <div class="header-title">
        <h1>Nexus</h1>
      </div>
      <nav class="header-nav">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/about" class="nav-link">About</router-link>
      </nav>
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


