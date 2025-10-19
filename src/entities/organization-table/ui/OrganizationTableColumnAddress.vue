<script setup lang="ts">
  import type { Organization } from '@entities/organization/model';

  interface IOrganizationTableColumnAddressProps {
    data: Organization['address'];
  }

  defineProps<IOrganizationTableColumnAddressProps>();
</script>

<template>
  <p>
    <span v-if="data.city">г. {{ data.city }},</span>
    {{ ' ' }}
    <span v-if="data.street">ул. {{ data.street }},</span>
    {{ ' ' }}
    <span v-if="data.building">д. {{ data.building }}</span>
  </p>
</template>
