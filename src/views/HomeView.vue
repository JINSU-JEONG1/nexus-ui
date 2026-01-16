<template>
  <div class="home d-flex flex-column vh-100">
    <!-- Header -->
    <Header 
      :is-sidebar-open="isSidebarOpen"
      @toggle-sidebar="toggleSidebar"
    />

    <!-- Main Content with Sidebar -->
    <div class="flex-grow-1 d-flex">
      <!-- Sidebar -->
      <Sidebar :is-open="isSidebarOpen" />

      <!-- Content Area -->
      <main class="flex-grow-1 p-4 overflow-auto">
        <div class="container-fluid">
          <h1 class="mb-4">홈</h1>
          <div class="row">
            <div class="col-12">
              <div class="card shadow-sm">
                <div class="card-body">
                  <h5 class="card-title">환영합니다</h5>
                  <p class="card-text">Nexus UI에 오신 것을 환영합니다.</p>
                  <img alt="nexus logo" src="/nexus_logo.svg" class="img-fluid mb-3" style="max-width: 200px;">
                  <HelloWorld msg="Welcome to Your Vue.js App"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/navigation/NavHeader.vue'
import Footer from '@/components/navigation/NavFooter.vue'
import Sidebar from '@/components/navigation/NavSidebar.vue'

export default {
  name: 'HomeView',
  components: {
    Header,
    Footer,
    Sidebar
  },
  data() {
    return {
      isSidebarOpen: true
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
.home {
  min-height: 100vh;
}
</style>
