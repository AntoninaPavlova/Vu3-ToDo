<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue';

const props = defineProps({
  taskText: String,
  taskId: Number,
  completed: Boolean,
  editedTaskId: Number,
});

const editedTaskText = ref(props.taskText);

const emit = defineEmits(['deleteTask', 'completeTask', 'startEditing', 'editTaskText']);

const deleteTask = () => {
  emit('deleteTask', props.taskId);
};

const completedTask = () => {
  emit('completedTask', props.taskId);
};

const startEditing = () => {
  emit('startEditing', props.taskId);
};

const editTaskText = (editTaskText) => {
  emit('editTaskText', editTaskText);
};

const isComparisonTaskId = computed(() => {
  return props.editedTaskId === props.taskId;
});
</script>

<template>
  <li class="app-task">
    <input
      type="checkbox"
      class="app-task__checkbox"
      @change="completedTask"
      :class="{ checked: completed, inactive: isComparisonTaskId }"
    />
    <div v-if="isComparisonTaskId" class="app-task__state">
      <input class="app-task__edit-input" v-model="editedTaskText" @keyup.enter="editTaskText($event.target.value)" />
    </div>

    <div v-else class="app-task__state">
      <span @click="startEditing" class="app-task__text" :class="{ inactive: completed }">{{ taskText }}</span>
    </div>
    <div @click="deleteTask" class="app-task___delete" :class="{ inactive: isComparisonTaskId }">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="23"
        height="23"
        viewBox="0,0,256,256"
        style="fill: #000000"
      >
        <g
          fill="#ffffff"
          fill-rule="nonzero"
          stroke="none"
          stroke-width="1"
          stroke-linecap="butt"
          stroke-linejoin="miter"
          stroke-miterlimit="10"
          stroke-dasharray=""
          stroke-dashoffset="0"
          font-family="none"
          font-weight="none"
          font-size="none"
          text-anchor="none"
          style="mix-blend-mode: normal"
        >
          <g transform="scale(8,8)">
            <path
              d="M15,4c-0.52344,0 -1.05859,0.18359 -1.4375,0.5625c-0.37891,0.37891 -0.5625,0.91406 -0.5625,1.4375v1h-6v2h1v16c0,1.64453 1.35547,3 3,3h12c1.64453,0 3,-1.35547 3,-3v-16h1v-2h-6v-1c0,-0.52344 -0.18359,-1.05859 -0.5625,-1.4375c-0.37891,-0.37891 -0.91406,-0.5625 -1.4375,-0.5625zM15,6h4v1h-4zM10,9h14v16c0,0.55469 -0.44531,1 -1,1h-12c-0.55469,0 -1,-0.44531 -1,-1zM12,12v11h2v-11zM16,12v11h2v-11zM20,12v11h2v-11z"
            ></path>
          </g>
        </g>
      </svg>
    </div>
  </li>
</template>

<style scoped>
.app-task {
  padding: 8px 16px;

  display: grid;
  grid-template-columns: 5% 1fr 14%;
  align-items: center;
  column-gap: 15px;

  background-color: var(--violet-color);
  color: var(--white-dark-color);

  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 4px;
}

.app-task__state {
  max-width: fit-content;
}

.app-task__checkbox {
  position: relative;
  appearance: none;
  width: 16px;
  height: 16px;
  border: 2px solid var(--white-color);
  border-radius: 50%;
  outline: none;
  cursor: pointer;
}

.app-task__label {
  position: relative;
  appearance: none;
  width: 16px;
  height: 16px;
  border: 2px solid var(--white-color);
  border-radius: 50%;
  outline: none;
  cursor: pointer;
}

.app-task__checkbox:checked {
  background-color: var(--white-color);
}

.app-task__checkbox:checked + .app-task__state .app-task__text {
  text-decoration: line-through;
}

.app-task__text {
  font-size: 16px;

  cursor: pointer;
}

.app-task___delete {
  justify-self: end;

  cursor: pointer;
}

.inactive {
  pointer-events: none;
  opacity: 0.5;
}

.app-task__edit-input {
  height: 25px;
  padding: 5px;
  border-radius: 4px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
</style>
