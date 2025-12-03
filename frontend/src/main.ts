import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useDesignerStore } from '@modules/designer/stores/designer.store';
import './assets/main.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Initialize auth state
const store = useDesignerStore();
store.initializeAuth();

app.mount('#app');
