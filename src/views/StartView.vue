<script setup>
import { v4 as uuidv4 } from 'uuid';

import ButtonResult from '@/components/ButtonResult.vue';
import DisplayInput from '@/components/general/DisplayInput.vue';
import TaskItem from '@/components/general/TaskItem.vue';

import {
  TASKS_KEY,
  IS_SHOW_SORTED_BTNS_KEY,
  IS_SHOW_CLEAR_BTN_KEY,
  LOCALE_KEY,
} from '@/consts/localStorageKeys/keys.js';

import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useLocalStorage } from '@vueuse/core';

import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n({ useScope: 'global' });

const toast = useToast();

const tasks = useLocalStorage(TASKS_KEY, []);
const isShowSortedBtns = useLocalStorage(IS_SHOW_SORTED_BTNS_KEY, false);
const isShowClearBtn = useLocalStorage(IS_SHOW_CLEAR_BTN_KEY, false);
const savedLocale = useLocalStorage(LOCALE_KEY, 'en');

const editedTaskId = ref(null);
const filterType = ref('all');

const updateTaskTextHandler = (task) => {
  const trimmedTask = task.trim();

  if (trimmedTask) {
    tasks.value.push({ id: uuidv4(), text: trimmedTask, completed: false });
    toast.success(t('notification.addTaskSuccess'));
  } else {
    toast.error(t('notification.addTaskEmpty'));
  }
};

const deleteTaskHandler = (id) => {
  tasks.value = tasks.value.filter((task) => task.id !== id);
  toast.success(t('notification.deleteTaskSuccess'));

  checkCompletedTasks();
};

const completedTaskHandler = (id) => {
  tasks.value = tasks.value.map((task) => {
    if (task.id === id) {
      const updatedTask = { ...task, completed: !task.completed };
      return updatedTask;
    }
    return task;
  });

  checkCompletedTasks();
};

const deleteCompletedTaskHandler = () => {
  const initialTasksLength = tasks.value.length;
  tasks.value = tasks.value.filter((task) => !task.completed);

  if (tasks.value.length < initialTasksLength) {
    toast.success(t('notification.deleteCompletedSuccess'));
  }

  checkCompletedTasks();
};

const checkCompletedTasks = () => {
  isShowClearBtn.value = tasks.value.some((task) => task.completed);

  useLocalStorage('isShowClearBtn', isShowClearBtn.value);
};

const startEditingHandler = (id) => {
  editedTaskId.value = id;
};

const editTaskTextHandler = (editedTaskText) => {
  const editedTrimmedTask = editedTaskText.trim();
  if (editedTrimmedTask === '') {
    toast.error(t('notification.taskTextEmpty'));
    return;
  }

  tasks.value = tasks.value.map((task) => {
    if (task.id === editedTaskId.value) {
      return { ...task, text: editedTaskText };
    }
    return task;
  });

  editedTaskId.value = null;
  toast.success(t('notification.editTaskSuccess'));
};

const changeFilter = (filter) => {
  filterType.value = filter;
};

const isShowSorted = computed(() => (isShowSortedBtns.value = tasks.value.length > 0));

const filteredTasks = computed(() => {
  let filteredList = tasks.value;

  if (filterType.value === 'active') {
    filteredList = tasks.value.filter((task) => !task.completed);
  } else if (filterType.value === 'completed') {
    filteredList = tasks.value.filter((task) => task.completed);
  }

  if (filteredList.length === 0) {
    filterType.value = 'all';
    return tasks.value;
  }

  return filteredList;
});

const isActiveBtnDisabled = computed(() => tasks.value.filter((task) => !task.completed).length === 0);
const isCompletedBtnDisabled = computed(() => tasks.value.filter((task) => task.completed).length === 0);

locale.value = savedLocale.value;

const changeLangHandler = () => {
  if (locale.value === 'en') {
    locale.value = 'ru';
    savedLocale.value = 'ru';
  } else if (locale.value === 'ru') {
    locale.value = 'en';
    savedLocale.value = 'en';
  }
};
</script>

<template>
  <div class="app-container">
    <main class="app-main">
      <section class="app-section">
        <h1 class="app-title">{{ $t('title') }}</h1>
        <div class="app-display">
          <DisplayInput @updateTaskText="updateTaskTextHandler" />
        </div>
        <div class="app-result">
          <div class="app-table">
            <ul class="app-list">
              <TaskItem
                v-for="task in filteredTasks"
                :key="task.id"
                :taskText="task.text"
                :taskId="task.id"
                :completed="task.completed"
                :editedTaskId="editedTaskId"
                :editedTaskText="task.editedTaskText"
                @deleteTask="deleteTaskHandler"
                @completedTask="completedTaskHandler"
                @startEditing="startEditingHandler"
                @editTaskText="editTaskTextHandler"
              />
            </ul>
          </div>
          <div v-if="isShowSorted" class="app-sorted">
            <div class="app-sorted__btns">
              <ButtonResult
                :label="$t('buttons.buttonAll')"
                btnClass="app-sorted__btn"
                @click="changeFilter('all')"
                :class="{ active: filterType === 'all' }"
                method="SortedButton"
              />
              <ButtonResult
                :label="$t('buttons.buttonActive')"
                btnClass="app-sorted__btn"
                @click="changeFilter('active')"
                :class="{ active: filterType === 'active' }"
                :disabled="isActiveBtnDisabled"
                method="SortedButton"
              />
              <ButtonResult
                :label="$t('buttons.buttonCompleted')"
                btnClass="app-sorted__btn"
                @click="changeFilter('completed')"
                :class="{ active: filterType === 'completed' }"
                :disabled="isCompletedBtnDisabled"
                method="SortedButton"
              />
            </div>
          </div>
          <div class="app-clear">
            <div class="app-clear__btns">
              <ButtonResult
                v-if="isShowClearBtn"
                :label="$t('buttons.buttonClear')"
                btnClass="app-clear__btn"
                @click="deleteCompletedTaskHandler"
                method="ClearButton"
              />
            </div>
          </div>
        </div>

        <div class="app-multilingualism">
          <p class="app-multilingualism__language" @click="changeLangHandler">{{ $t('changeLang') }}</p>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  position: relative;
  max-width: 430px;
  width: 100%;
  margin: 0 auto;
}

.app-title {
  font-size: 36px;
  font-weight: 400;
  text-align: center;
}

.app-title,
.app-display,
.app-table {
  margin-bottom: 24px;
}

.app-list {
  display: flex;
  flex-direction: column;
  border-radius: 4px;
}

.app-sorted__btns {
  margin-bottom: 15px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 7px;
}

.app-sorted__btn,
.app-clear__btn {
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

.app-sorted__btn {
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.app-clear__btn {
  margin-bottom: 15px;
  width: 100%;
}

.active {
  border: 1px solid #fff;
}

.app-multilingualism__language {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;

  text-align: center;

  cursor: pointer;
}

@media (max-width: 1169.98px) {
  .app-sorted__btn,
  .app-clear__btn {
    &:hover {
      background-color: inherit;
      color: inherit;
    }
  }
}

@media (max-width: 414.98px) {
  .app-sorted__btn,
  .app-clear__btn {
    font-size: 12px;
  }
}
</style>
