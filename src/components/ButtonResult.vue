<script setup>
const props = defineProps({
  label: String,
  btnClass: String,
});

const handleClick = () => {
  if (props.method === 'ClearButton') {
    deleteCompletedTask();
  } else if (props.method === 'SortedButton') {
    sortTasks();
  }
};
</script>

<template>
  <button @click="handleClick" type="button" :class="btnClass">{{ label }}</button>
</template>
