<template>
  <div class="default-layout d-flex flex-column min-vh-100">
    <!-- Header -->
    <Header 
      :is-sidebar-open="false"
      @toggle-sidebar="toggleSidebar"
    />

    <!-- Main Content with Sidebar -->
    <div class="flex-grow-1 d-flex">
      <!-- Sidebar -->
      <!-- <Sidebar :is-open="!isSidebarOpen" /> -->

      <!-- Content Area -->
      <main class="flex-grow-1 p-4">
        <slot />
      </main>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/navigation/NavHeader.vue'
import Footer from '@/components/navigation/NavFooter.vue'
// import Sidebar from '@/components/navigation/NavSidebar.vue'

export default {
  name: 'DefaultLayout',
  components: {
    Header,
    Footer,
    // Sidebar 
  },
  data() {
    return {
      isSidebarOpen: false
    }
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    }
  }
}
</script>

<style scoped>
.default-layout {
  min-height: 100vh;
}
</style>

