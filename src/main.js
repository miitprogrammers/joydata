import './index.css';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { id as vuetifyId, ja as vuetifyJa } from 'vuetify/locale';
import { registerSW } from 'virtual:pwa-register';

import App from './App.vue';
import PwaInstallPrompt from './components/PwaInstallPrompt.vue';
import { router } from './router/index.js';
import idMessages from './locales/id.js';
import jaMessages from './locales/ja.js';
import { getInitialLocale } from './stores/appStore.js';

const initialLocale = getInitialLocale();
if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLocale;
}

const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'id',
  messages: {
    id: idMessages,
    ja: jaMessages,
  },
});

const vuetify = createVuetify({
  components,
  directives,
  locale: {
    locale: initialLocale,
    fallback: 'id',
    messages: {
      id: vuetifyId,
      ja: vuetifyJa,
    },
  },
  theme: {
    defaultTheme: 'joyLight',
    themes: {
      joyLight: {
        dark: false,
        colors: {
          background: '#F8FAFC',
          surface: '#FFFFFF',
          primary: '#1D4ED8',
          secondary: '#475569',
          success: '#047857',
          warning: '#D97706',
          error: '#B91C1C',
          info: '#0284C7',
        },
      },
    },
  },
});

const app = createApp(App);
app.use(createPinia());
app.use(i18n);
app.use(vuetify);
app.use(router);
app.component('PwaInstallPrompt', PwaInstallPrompt);
app.mount('#root');

registerSW({ immediate: true });

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.log('SW registration failed:', err);
    });
  });
}
