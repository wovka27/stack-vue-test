<script setup lang="ts">
  import { onUpdated } from 'vue';
  import BaseModal from '@entities/base-modal/ui';
  import { useOrganizationFormModal } from '@entities/organization-form-modal/lib';
  import { formFieldsRegistrySchema } from '@entities/organization-form-modal/model/formFieldsRegistrySchema.ts';
  import type { Organization } from '@entities/organization/model';
  import { generateId } from '@shared/lib/utils';

  interface OrganizationFormModalProps {
    title: string;
    data: Organization | null;
  }

  const props = defineProps<OrganizationFormModalProps>();
  const emit = defineEmits<{
    (event: 'cancel'): void;
    (event: 'submit', value: Organization): void;
  }>();

  const isOpen = defineModel<boolean>({
    default: false,
  });

  const form = useOrganizationFormModal();

  const submit = (cb: () => void) =>
    form.handleSubmit(async (data: Omit<Organization, 'address'> & Organization['address']): Promise<void> => {
      const result: Organization = {
        ...data,
        address: {
          building: data.building,
          street: data.street,
          city: data.city,
        },
      };
      emit('submit', result);
      cb();
    });

  const cancel = () => {
    form.reset();
    emit('cancel');
  };

  onUpdated(() => {
    form.fields.name.value.value = props.data?.name || '';
    form.fields.director.value.value = props.data?.director || '';
    form.fields.building.value.value = props.data?.address.building || '';
    form.fields.city.value.value = props.data?.address.city || '';
    form.fields.street.value.value = props.data?.address.street || '';
    form.fields.phone.value.value = props.data?.phone || '';
    form.fields.id.value.value = props.data?.id || generateId();
  });
</script>

<template>
  <base-modal
    v-model="isOpen"
    @on-cancel="cancel"
  >
    <template #header>
      <p class="organization-form-modal__title">{{ title }}</p>
    </template>
    <template #body="{ close }">
      <ui-form-generator
        form-id="organization-form-modal"
        classes="organization-form-modal__body"
        :schema="formFieldsRegistrySchema"
        :form="form"
        @form-submit="submit(close)"
      />
    </template>
    <template #footer="{ close }">
      <div class="organization-form-modal__footer">
        <ui-button
          variant="outline"
          @click="close"
        >
          отмена
        </ui-button>
        <ui-button
          :disabled="!form.isValid.value"
          form="organization-form-modal"
          type="submit"
        >
          сохранить
        </ui-button>
      </div>
    </template>
  </base-modal>
</template>

<style lang="scss">
  .organization-form-modal {
    &__body,
    &__group,
    &__footer {
      display: flex;
      gap: 10px;
    }
    &__body {
      flex-direction: column;
    }
    &__title {
      font-size: 20px;
    }
    &__footer {
      width: 100%;
      justify-content: flex-end;
    }
  }
</style>
