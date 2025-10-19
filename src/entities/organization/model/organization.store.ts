import { defineStore } from 'pinia';
import { mockOrganizations, storageApi } from '@entities/organization/api';
import type { Organization } from '@entities/organization/model/organization.types.ts';

type Meta = {
  total: number;
  perPage: number;
  page: number;
};

type SortDirection = 'asc' | 'desc' | null;

type Sort = {
  key: keyof Organization | '';
  direction: SortDirection;
};

type OrganizationState = {
  list: Organization[];
  meta: Meta;
  sort: Sort;
  search: string;
};

export const useOrganizationStore = defineStore('organization', {
  state: (): OrganizationState => ({
    list: [],
    search: '',
    meta: {
      perPage: 5,
      total: 1,
      page: 1,
    },
    sort: {
      key: '',
      direction: null,
    },
  }),
  getters: {
    perPage: (state: OrganizationState) => state.meta.perPage,
    page: (state: OrganizationState) => state.meta.page,
    filteredList: (state: OrganizationState) => {
      if (!state.search) return state.list;

      const term = state.search.toLowerCase();

      return state.list.filter((item) => item.director.toLowerCase().includes(term));
    },
  },
  actions: {
    setSearch(value: string) {
      this.setMeta('page', 1);
      this.search = value;
    },
    setMeta(key: keyof Meta, value: number) {
      this.meta = { ...this.meta, [key]: value };
    },
    getList() {
      this.list = storageApi.get() || mockOrganizations;
    },
    addItem(organization: Organization) {
      this.list.push(organization);
      this.syncStorage();
    },
    removeItem(id: string) {
      const index = this.list.findIndex((i) => i.id === id);
      if (index !== -1) {
        this.list.splice(index, 1);
        this.syncStorage();
      }
    },
    updateItem(id: string, organization: Organization) {
      const index = this.list.findIndex((i) => i.id === id);
      if (index !== -1) {
        this.list.splice(index, 1, organization);
        this.syncStorage();
      }
    },
    syncStorage() {
      if (!this.list.length) {
        storageApi.remove();
        return;
      }

      storageApi.set(this.list);
    },
  },
  debounce: {
    setSearch: 300,
  },
});
