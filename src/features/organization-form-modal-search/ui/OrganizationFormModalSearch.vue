<script setup lang="ts">
  import { useOrganizationStore } from '@entities/organization/model';

  const store = useOrganizationStore();
</script>

<template>
  <ui-input
    :model-value="store.search"
    placeholder="Найти по ФИО..."
    @update:model-value="store.setSearch"
  />
</template>
