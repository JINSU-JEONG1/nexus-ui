<template>
  <div id="app">
    <div class="mesh-background"></div>
    <DefaultLayout>
      <router-view />
    </DefaultLayout>
  </div>
</template>

<script setup>
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
</script>

<style>

</style>
