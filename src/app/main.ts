import { createApp } from 'vue';
import App from '@app/App.vue';
import '@app/assets/styles/index.scss';
import { withProviders } from '@app/providers';

const app = createApp(App);

withProviders(app);

app.mount('#app');
