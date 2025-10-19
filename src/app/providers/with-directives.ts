import type { App } from 'vue';
import ImaskPlugin from '@shared/lib/directives/imask.ts';

export const withDirectives = (app: App<Element>) => {
  app.use(ImaskPlugin);
};
