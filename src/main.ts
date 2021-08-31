import { createApp } from 'vue';
import I18n from '@util/i18n';
import BaseComponents from '@util/register-components';
import App from '@/App.vue';
import Router from '@/router';
import Store from '@/store';

createApp(App).use(Router).use(Store).use(I18n)
  .use(BaseComponents)
  .mount('#app');
