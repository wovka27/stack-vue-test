import type { App } from 'vue';
import { withDirectives } from '@app/providers/with-directives.ts';
import { withRouter } from '@app/providers/with-router.ts';
import { withStore } from '@app/providers/with-store.ts';

export const withProviders = (app: App<Element>) => {
  withStore(app);
  withRouter(app);
  withDirectives(app);
};
