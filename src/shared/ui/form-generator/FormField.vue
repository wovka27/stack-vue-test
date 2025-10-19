<script setup lang="ts" generic="T extends Record<keyof T, T[keyof T]>">
  import { useForm } from '@shared/lib/composables';
  import { getComponent } from '@shared/ui/form-generator/lib';
  import type { FieldGroup, FormField } from '@shared/ui/form-generator/model';

  interface FormFieldProps<T extends Record<string, unknown>> {
    field: FormField<T>;
    form: ReturnType<typeof useForm<T>>;
  }

  defineProps<FormFieldProps<T>>();

  const isGroup = <T extends Record<keyof T, T[keyof T]>>(field: FormField<T>): field is FieldGroup<T> => {
    return field.type === 'group';
  };
</script>

<template>
  <div
    v-if="isGroup(field)"
    :class="field.class"
  >
    <template
      v-for="sub in field.fields"
      :key="sub.key"
    >
      <FormField
        :field="sub"
        :form="form"
      />
    </template>
  </div>

  <component
    :is="getComponent(field.type)"
    v-else
    v-bind="field"
    v-model="form.fields[field.key].value.value as string"
    :error="form.fields[field.key].error.value ?? ''"
    @blur="form.fields[field.key].onBlur"
    @focus="form.fields[field.key].onFocus"
  />
</template>
