<script setup lang="ts" generic="T extends Record<keyof T, T[keyof T]>">
  import { useForm } from '@shared/lib/composables';
  import type { FormSchema } from '@shared/ui/form-generator/model';

  interface Props<P extends T> {
    schema: FormSchema<P>;
    form: ReturnType<typeof useForm<P>>;
    formId?: string;
    classes?: string | Record<string, boolean> | (Record<string, boolean> | string)[];
  }

  defineProps<Props<T>>();
  defineEmits<{
    (event: 'form-submit'): void;
  }>();
</script>

<template>
  <form
    :id="formId"
    class="form-generator"
    :class="classes"
    novalidate
    @submit.prevent="$emit('form-submit')"
  >
    <template
      v-for="field in schema"
      :key="field.key"
    >
      <FormField
        :field="field"
        :form="form"
      />
    </template>
  </form>
</template>

<style scoped lang="scss">
  .form-generator {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
