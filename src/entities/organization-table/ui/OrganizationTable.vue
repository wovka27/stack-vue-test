<script setup lang="ts">
  import OrganizationFormModalSearch from '@features/organization-form-modal-search/ui';
  import OrganizationFormModal from '@entities/organization-form-modal/ui';
  import { columnsRegistry } from '@entities/organization-table/config';
  import { useOrganizationTable } from '@entities/organization-table/lib';
  import OrganizationTableColumnAddress from '@entities/organization-table/ui/OrganizationTableColumnAddress.vue';
  import { useOrganizationStore } from '@entities/organization/model';

  const store = useOrganizationStore();
  const { update, modalTitle, add, cancel, submit, remove, isOpen, selectedItem } = useOrganizationTable(store);
</script>

<template>
  <div class="organization-table container">
    <div class="organization-table__header">
      <OrganizationFormModalSearch />
      <ui-button @click="add">Добавить</ui-button>
    </div>
    <!-- @vue-generic {import('@entities/organization/model').Organization} -->
    <UiTable
      :columns="columnsRegistry"
      :rows="store.filteredList"
      :page="store.page"
      :per-page="store.perPage"
      :sort="store.sort"
      actions
      clickable-item
      @click-item="update"
      @update:page="store.setMeta('page', $event)"
      @update:per-page="store.setMeta('perPage', $event)"
    >
      <template #col-address="{ col, row }">
        <OrganizationTableColumnAddress :data="row[col.key]" />
      </template>
      <template #actions="{ row }">
        <ui-button
          variant="outline"
          @click.stop="remove(row)"
        >
          X
        </ui-button>
      </template>
    </UiTable>
  </div>
  <OrganizationFormModal
    v-model="isOpen"
    :data="selectedItem"
    :title="modalTitle"
    @cancel="cancel"
    @submit="submit"
  />
</template>

<style lang="scss">
  .organization-table {
    height: 100%;
    padding: 20px;
    overflow: auto;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    &__header {
      display: flex;
      gap: 20px;
    }

    &__empty {
      width: 100%;
      height: 30vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
