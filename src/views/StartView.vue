<script setup>
import SortedButton from '@/components/buttons/SortedButton.vue';
import ClearButton from '@/components/buttons/ClearButton.vue';
import DisplayInput from '@/components/general/DisplayInput.vue';
import TaskItem from '@/components/general/TaskItem.vue';

import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useLocalStorage } from '@vueuse/core';

const toast = useToast();

const tasks = useLocalStorage('tasks', []);
const isShowSortedBtns = useLocalStorage('isShowSortedBtns', false);
const isShowClearBtn = useLocalStorage('isShowClearBtn', false);
const editedTaskId = ref(null);
const filterType = ref('all');

// Так, смотри
// Хорошей практикой является вынесение локалсторадж ключей в отдельный файл
// Я бы в папке consts создал бы папку с названием localStorageKeys
// И туда бы поместил все ключи, так как при написании ключа можно допустить ошибку
// И вообще в целом вынесение текстовых значений является хорошей практикой)

// То же самое касается и вынесение сообщений в тостах.
// Смотри как это сделал я
// https://github.com/gorbatkoff/sfedu-schedule/blob/master/src/shared/const/toast/toast.ts

// Я думаю лучше использовать какую-нибудь библиотеку для генерации
// рандомных id
// Советую присмотреться к библиотек под нзванием uuid
const generateUniqueId = () => Date.now();

const updateTaskTextHandler = (task) => {
  const trimmedTask = task.trim();

  if (trimmedTask) {
    tasks.value.push({ id: generateUniqueId(), text: trimmedTask, completed: false });
    toast.success('Задача успешно добавлена');
  } else {
    toast.error('Пожалуйста, введите текст задачи');
  }
};

const deleteTaskHandler = (id) => {
  tasks.value = tasks.value.filter((task) => task.id !== id);
  toast.success('Задача успешно удалена');

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
    toast.success('Выполненные задачи были удалены');
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
    toast.error('Текст задачи не может быть пустым!');
    return;
  }

  tasks.value = tasks.value.map((task) => {
    if (task.id === editedTaskId.value) {
      return { ...task, text: editedTaskText };
    }
    return task;
  });

  editedTaskId.value = null;
  toast.success('Задача успешно отредактирована!');
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
</script>

<template>
  <div class="app-container">
    <main class="app-main">
      <section class="app-section">
        <h1 class="app-title">Todo List</h1>
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
              <SortedButton
                label="All"
                btnClass="btn--all"
                @click="changeFilter('all')"
                :class="{ active: filterType === 'all' }"
              />
              <SortedButton
                label="Active"
                btnClass="btn--active"
                @click="changeFilter('active')"
                :class="{ active: filterType === 'active' }"
                :disabled="isActiveBtnDisabled"
              />
              <SortedButton
                label="Completed"
                btnClass="btn--completed"
                @click="changeFilter('completed')"
                :disabled="isCompletedBtnDisabled"
                :class="{ active: filterType === 'completed' }"
              />
            </div>
          </div>
          <div class="app-clear">
            <div class="app-clear__btns">
              <ClearButton
                v-if="isShowClearBtn"
                label="Clear completed"
                @deleteCompletedTask="deleteCompletedTaskHandler"
              />
            </div>
          </div>
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

.app-sorted__btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.active {
  border: 1px solid #fff;
}
</style>
