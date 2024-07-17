<script setup>
import { defineEmits, ref } from 'vue';
import * as Emits from '@/consts/emits.js';

import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });

const emit = defineEmits([Emits.UPDATE_TASK_TEXT_EMIT]);

const taskText = ref('');

const updateTaskText = () => {
  emit(Emits.UPDATE_TASK_TEXT_EMIT, taskText.value);
  taskText.value = '';
};
</script>

<template>
  <input
    type="text"
    class="app-display__input"
    :placeholder="$t('placeholder')"
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
