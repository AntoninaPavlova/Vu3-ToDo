<script setup>
import { defineEmits, ref } from 'vue';

const emit = defineEmits(['updateTaskTextEvent']);
const taskText = ref('');

const updateTaskText = () => {
  const task = taskText.value.trim();

  if (task) {
    emit('updateTaskTextEvent', taskText.value);
    taskText.value = '';
  }
};
</script>

<template>
  <input
    type="text"
    class="app-display__input"
    placeholder="What needs to be done?"
    @keyup.enter="updateTaskText"
    v-model="taskText"
  />
</template>

<style scoped>
.app-display__input {
  width: 100%;
  padding: 6px 12px;

  color: var(--white-color);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;

  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;

  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  &:focus {
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  }
}

.app-display__input::placeholder {
  color: var(--gray-color);
}
</style>
