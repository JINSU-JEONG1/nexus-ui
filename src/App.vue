<template>
  <div id="app">
    <DefaultLayout>
      <router-view />
    </DefaultLayout>
  </div>
</template>

<script>
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

export default {
  name: 'App',
  components: {
    DefaultLayout
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1d1d1f;
  background: #ffffff;
}
</style>
