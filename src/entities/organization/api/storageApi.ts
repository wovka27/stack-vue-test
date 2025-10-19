import type { Organization } from '@entities/organization/model';
import { storage } from '@shared/lib/utils';

const STORAGE_KEY = 'organization';

export const storageApi = {
  get: () => storage.get<Organization[]>(STORAGE_KEY),
  set: (value: Organization[]) => storage.set(STORAGE_KEY, value),
  remove: () => storage.remove(STORAGE_KEY),
};
