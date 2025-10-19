import type { Organization } from '@entities/organization/model';
import type { FormSchema } from '@shared/ui/form-generator/model';

export const formFieldsRegistrySchema: FormSchema<Omit<Organization, 'address' | 'id'> & Organization['address']> = [
  { key: 'name', label: 'Название', type: 'text', placeholder: 'Введите название' },
  { key: 'director', label: 'ФИО директора', type: 'text', placeholder: 'Иванов Иван Иванович' },
  { key: 'phone', label: 'Телефон', type: 'phone', placeholder: '+7 000 000 00 00' },
  { key: 'city', label: 'Город', type: 'text', placeholder: '' },
  {
    type: 'group',
    class: 'organization-form-modal__group',
    fields: [
      { key: 'street', label: 'Улица', type: 'text', placeholder: '' },
      { key: 'building', label: 'Дом', type: 'text', placeholder: '' },
    ],
  },
];
