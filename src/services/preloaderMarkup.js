// The preloader design lives in index.html because the boot splash has to render before the app
// bundle loads. Capture its markup once (before App.vue removes the splash) so the in-app page
// preloader shows exactly the same thing. It is static, app-owned markup, so v-html is safe.
export const preloaderMarkup =
  typeof document !== 'undefined'
    ? document.querySelector('#boot-splash .joy-preloader')?.outerHTML || ''
    : '';
