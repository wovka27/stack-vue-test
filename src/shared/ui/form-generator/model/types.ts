export type FieldType = 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'group' | 'phone';

export interface FormFieldBase<K extends string> {
  key: K;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  type: Exclude<FieldType, 'group'>;
  class?: string;
}

export interface FormInputField<K extends string> extends FormFieldBase<K> {
  type: Exclude<FieldType, 'select' | 'group'> | 'email' | 'number' | 'text';
}

export interface FormSelectField<K extends string> extends FormFieldBase<K> {
  type: 'select';
  options: { label: string; value: string | number }[];
}

export interface FieldGroup<T extends Record<keyof T, T[keyof T]>> {
  type: 'group';
  class?: string;
  fields: FormSchema<T>;
}

export type FormField<T extends Record<keyof T, T[keyof T]>> =
  | FormInputField<Extract<keyof T, string>>
  | FormSelectField<Extract<keyof T, string>>
  | FieldGroup<T>;

export type FormSchema<T extends Record<keyof T, T[keyof T]>> = FormField<T>[];
