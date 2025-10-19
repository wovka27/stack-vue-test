import type { App } from 'vue';
import { store } from '@app/store';
import { storeDebouncePlugin } from '@shared/lib/plugins/storeDebouncePlugin.ts';

export const withStore = (app: App<Element>) => {
  app.use(store);
  storeDebouncePlugin(store);
};
