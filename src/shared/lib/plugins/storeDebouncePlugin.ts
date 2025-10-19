import type { Pinia } from 'pinia';
import { debounce } from '@shared/lib/utils';

export const storeDebouncePlugin = (store: Pinia) => {
  store.use(({ options, store }) => {
    if (options.debounce) {
      return Object.keys(options.debounce).reduce((debouncedActions, action) => {
        debouncedActions[action] = debounce(store[action], options.debounce![action]);
        return debouncedActions;
      }, {});
    }
  });
};
