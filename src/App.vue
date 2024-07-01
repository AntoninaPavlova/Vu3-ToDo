<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="app-wrapper">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<style scoped>
.app-wrapper {
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 20px;

  color: var(--white-color);

  box-sizing: border-box;
  overflow: hidden;
}

@media (max-width: 991.98px) {
  .app-wrapper {
    padding: 90px 20px;
  }
}
</style>
