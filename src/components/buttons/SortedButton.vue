<script setup>
const props = defineProps({
  label: String,
  btnClass: String,
});
</script>

<template>
  <button type="button" class="app-sorted__btn" :class="btnClass">{{ label }}</button>
</template>

<style scoped>
.app-sorted__btn {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white-color);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  &:hover {
    background-color: var(--white-color);
    color: var(--violet-color);
  }
}

@media (max-width: 1169.98px) {
  .app-sorted__btn {
    &:hover {
      background-color: inherit;
      color: inherit;
    }
  }
}
</style>
