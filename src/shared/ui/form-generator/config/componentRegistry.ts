import UiInput from '@shared/ui/input/UiInput.vue';
import UiSelect from '@shared/ui/select/UiSelect.vue';

export const componentRegistry = {
  text: UiInput,
  email: UiInput,
  phone: UiInput,
  number: UiInput,
  password: UiInput,
  select: UiSelect,
} as const;
