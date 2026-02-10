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

<script setup>
import { ref } from 'vue'
import Header from '@/components/navigation/NavHeader.vue'
import Footer from '@/components/navigation/NavFooter.vue'
// import Sidebar from '@/components/navigation/NavSidebar.vue'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<style scoped>
.default-layout {
  min-height: 100vh;
}
</style>

