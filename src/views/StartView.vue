<script setup>
import SortedButton from '@/components/buttons/SortedButton.vue';
import ClearButton from '@/components/buttons/ClearButton.vue';
import DisplayInput from '@/components/general/DisplayInput.vue';
import TaskItem from '@/components/general/TaskItem.vue';

import { ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

const tasks = ref([]);
const isShowResult = ref(false);
const isShowClearBtn = ref(false);
const editingTaskId = ref(null);

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
  editingTaskId.value = id;
};

const editingTaskTextHandler = (newText) => {
  tasks.value = tasks.value.map((task) => {
    if (task.id === editingTaskId.value) {
      return { ...task, text: newText };
    }
    return task;
  });
  editingTaskId.value = null;
  toast.success('Задача успешно отредактирована!');
};
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
                v-for="task in tasks"
                :key="task.id"
                :taskText="task.text"
                :taskId="task.id"
                :completed="task.completed"
                :editingTaskId="editingTaskId"
                :newText="task.newText"
                @deleteTask="deleteTaskHandler"
                @completedTask="completedTaskHandler"
                @startEditing="startEditingHandler"
                @editingTaskText="editingTaskTextHandler"
              />
            </ul>
          </div>
          <div class="app-sorted">
            <div class="app-sorted__btns">
              <SortedButton label="All" btnClass="btn--all" />
              <SortedButton label="Active" btnClass="btn--active" />
              <SortedButton label="Completed" btnClass="btn--completed" />
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
</style>
