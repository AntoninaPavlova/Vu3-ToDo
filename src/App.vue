<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <div>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<style scoped>
</style>
