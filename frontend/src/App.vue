<template>
  <div class="app-container">
    <NavBar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
</script>

<style>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f1e8 0%, #e8e4d9 100%);
}

.main-content {
  padding-top: 60px;
  min-height: 100vh;
}
</style>
