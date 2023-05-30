import './assets/main.scss';
import { createApp } from 'vue';
import App from './App.vue';
import VMdPreview from '../plugins/VMdPreview';

const app = createApp(App);
app.use(VMdPreview);
app.mount('#app');
