import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import Toast from 'vue-toastification';

import './assets/main.css';
import 'vue-toastification/dist/index.css';

const app = createApp(App);

const options = {
  timeout: 3000,
};

app.use(Toast, options);

app.use(router);

app.mount('#app');
