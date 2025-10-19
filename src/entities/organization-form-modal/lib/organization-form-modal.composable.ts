import type { Organization } from '@entities/organization/model';
import { defineField, useForm } from '@shared/lib/composables';

export const useOrganizationFormModal = () => {
  return useForm<Omit<Organization, 'address'> & Organization['address']>({
    building: defineField({
      initialValue: '',
      validators: ({ required }) => [required],
    }),
    city: defineField({
      initialValue: '',
      validators: ({ required }) => [required],
    }),
    street: defineField({
      initialValue: '',
      validators: ({ required }) => [required],
    }),
    director: defineField({
      initialValue: '',
      validators: ({ required }) => [required],
    }),
    id: defineField({
      initialValue: '',
      validators: ({ required }) => [required],
    }),
    name: defineField({
      initialValue: '',
      validators: ({ required }) => [required],
    }),
    phone: defineField({
      initialValue: '',
      validators: ({ required, phone }) => [required, phone],
    }),
  });
};
