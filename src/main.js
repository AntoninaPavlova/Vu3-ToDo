import { createApp } from 'vue';
import { createI18n, useI18n } from 'vue-i18n';

import App from './App.vue';
import router from './router';
import Toast from 'vue-toastification';

import './styles/reset.css';
import 'vue-toastification/dist/index.css';

import { languages } from './i18n';
import { defaultLocale } from './i18n';

const messages = Object.assign(languages);
const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages,
});

const app = createApp(App);

app.use(Toast);
app.use(router);
app.use(i18n);

app.mixin({
  setup() {
    const { t } = useI18n();
    return { t };
  },
});

app.mount('#app');
