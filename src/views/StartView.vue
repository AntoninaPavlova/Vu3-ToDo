<script setup>
import SortedButton from '@/components/buttons/SortedButton.vue';
import ClearButton from '@/components/buttons/ClearButton.vue';
import DisplayInput from '@/components/general/DisplayInput.vue';
import TaskItem from '@/components/general/TaskItem.vue';

import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

const tasks = ref([]);
const isShowResult = ref(false);
const isShowClearBtn = ref(false);
const editedTaskId = ref(null);
const filterType = ref('all');

const generateUniqueId = () => Date.now();

const updateTaskTextHandler = (task) => {
  const trimmedTask = task.trim();

  if (trimmedTask) {
    tasks.value.push({ id: generateUniqueId(), text: trimmedTask, completed: false });
    isShowResult.value = true;
    toast.success('Задача успешно добавлена');
  } else {
    toast.error('Пожалуйста, введите текст задачи');
  }
};

const deleteTaskHandler = (id) => {
  tasks.value = tasks.value.filter((task) => task.id !== id);
  isShowResult.value = tasks.value.length > 0;
  toast.success('Задача успешно удалена');
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
    isShowResult.value = tasks.value.length > 0;
    toast.success('Выполненные задачи были удалены');
  }
};

const checkCompletedTasks = () => {
  isShowClearBtn.value = tasks.value.some((task) => task.completed);
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

const filteredTasks = computed(() => {
  if (filterType.value === 'active') {
    return tasks.value.filter((task) => !task.completed);
  } else if (filterType.value === 'completed') {
    return tasks.value.filter((task) => task.completed);
  } else {
    return tasks.value;
  }
});

const changeFilter = (filter) => {
  filterType.value = filter;
};

const isActiveBtnDisabled = computed(
  () => filterType.value === 'active' || tasks.value.filter((task) => !task.completed).length === 0
);
const isCompletedBtnDisabled = computed(
  () => filterType.value === 'completed' || tasks.value.filter((task) => task.completed).length === 0
);
</script>

<template>
  <div class="app-container">
    <main class="app-main">
      <section class="app-section">
        <h1 class="app-title">Todo List</h1>
        <div class="app-display">
          <DisplayInput @updateTaskText="updateTaskTextHandler" />
        </div>
        <div v-if="isShowResult" class="app-result">
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
          <div class="app-sorted">
            <div class="app-sorted__btns">
              <SortedButton label="All" btnClass="btn--all" @click="changeFilter('all')" />
              <SortedButton
                label="Active"
                btnClass="btn--active"
                @click="changeFilter('active')"
                :class="{ disabled: isActiveBtnDisabled }"
              />
              <SortedButton
                label="Completed"
                btnClass="btn--completed"
                @click="changeFilter('completed')"
                :class="{ disabled: isCompletedBtnDisabled }"
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

.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
