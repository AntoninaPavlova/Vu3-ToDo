import { createRouter, createWebHistory } from 'vue-router';
import StartView from '@/views/StartView.vue';
import { Routes } from '@/consts/routes/Routes';

const routes = [
  {
    ...Routes.START,
    component: StartView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;
