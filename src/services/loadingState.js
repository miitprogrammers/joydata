import { ref } from 'vue';

// Number of API requests in flight; drives the global progress bar and the page preloader.
export const pendingRequests = ref(0);
