import type { App } from 'vue';
import { router } from '@app/router';

export const withRouter = (app: App<Element>) => {
  app.use(router);
};
