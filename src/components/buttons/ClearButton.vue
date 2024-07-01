<script setup>
const props = defineProps({
  label: String,
});
</script>

<template>
  <button type="button" class="app-clear__btn btn--clear-completed">{{ label }}</button>
</template>

<style scoped>
.app-clear__btn {
  width: 100%;
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
</style>
