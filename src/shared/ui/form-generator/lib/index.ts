import { componentRegistry } from '@shared/ui/form-generator/config';
import UiInput from '@shared/ui/input/UiInput.vue';

export const getComponent = (type: string) => componentRegistry[type as keyof typeof componentRegistry] ?? UiInput;
