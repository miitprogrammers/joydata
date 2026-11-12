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
import { getInitialLocale, useAppStore } from './stores/appStore.js';
import { onSessionExpired } from './services/api.js';
import { onPortalSessionExpired } from './services/portalApi.js';
import { clearPortalSession } from './services/portalSession.js';

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

// The server rejected a session (expired, password reset, account switched off): say so and go to the login
// page, instead of leaving a screen whose every request fails. Network and server errors never land here.
onSessionExpired(() => {
  const appStore = useAppStore();
  const wasSignedIn = appStore.isAuthenticated;
  appStore.sessionExpired();
  appStore.notify(i18n.global.t('messages.SESSION_EXPIRED'), 'warning');
  if (wasSignedIn && !router.currentRoute.value.meta.public) router.replace('/login');
});
onPortalSessionExpired(() => {
  clearPortalSession();
  useAppStore().notify(i18n.global.t('portal.sesiBerakhir'), 'warning');
  const { meta } = router.currentRoute.value;
  if (meta.portal && !meta.portalPublic) router.replace('/portal/login');
});
app.mount('#root');

registerSW({ immediate: true });

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.log('SW registration failed:', err);
    });
  });
}
