<template>
  <div class="default-layout">
    <header class="layout-header">
      <h1>Nexus UI v3</h1>
      <nav>
        <RouterLink to="/">홈</RouterLink>
        <RouterLink to="/about">소개</RouterLink>
      </nav>
    </header>

    <main class="layout-content">
      <slot />
    </main>

    <footer class="layout-footer">
      <p>&copy; 2025 Nexus UI</p>
    </footer>
  </div>
</template>

<style scoped>
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-header {
  padding: 1rem 2rem;
  background-color: #42b883;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.layout-header nav a {
  color: white;
  margin-left: 1rem;
  text-decoration: none;
}

.layout-content {
  flex: 1;
  padding: 2rem;
}

.layout-footer {
  padding: 1rem;
  background-color: #f5f5f5;
  text-align: center;
}
</style>

