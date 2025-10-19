import { computed, ref } from 'vue';
import { type Organization, useOrganizationStore } from '@entities/organization/model';

export const useOrganizationTable = (store: ReturnType<typeof useOrganizationStore>) => {
  const actionType = ref<'add' | 'edit'>('add');
  const isOpen = ref<boolean>(false);
  const selectedItem = ref<Organization | null>(null);

  const modalTitle = computed(() => {
    const text = {
      add: 'Добавить',
      edit: 'Редактировать',
    };

    return `${text[actionType.value]} организацию`;
  });

  const remove = (row: Organization) => {
    store.removeItem(row.id);
  };

  const update = ({ row }) => {
    actionType.value = 'edit';
    isOpen.value = true;
    selectedItem.value = row;
  };
  const add = () => {
    actionType.value = 'add';
    isOpen.value = true;
  };

  const cancel = () => {
    selectedItem.value = null;
  };

  const submit = (value: Organization) => {
    const submitHandle = {
      add: store.addItem.bind(null, value),
      edit: store.updateItem.bind(null, selectedItem.value?.id || '', value),
    };

    submitHandle[actionType.value]();
  };

  store.getList();

  return {
    modalTitle,
    isOpen,
    selectedItem,
    remove,
    update,
    add,
    cancel,
    submit,
  };
};
