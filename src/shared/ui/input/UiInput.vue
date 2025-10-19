<script setup lang="ts">
  import { computed } from 'vue';

  interface UiInputProps {
    placeholder?: string;
    type?: HTMLInputElement['type'] | 'phone';
    label?: string;
    error?: string | null;
    disabled?: boolean;
  }

  const props = withDefaults(defineProps<UiInputProps>(), {
    type: 'text',
    placeholder: '',
    label: '',
    error: null,
    disabled: false,
  });

  const model = defineModel<string, 'phone'>({ required: true });

  const classes = computed(() => [
    'ui-input',
    { 'ui-input--error': !!props.error },
    { 'ui-input--disabled': props.disabled },
  ]);
</script>

<template>
  <label class="ui-input__wrapper">
    <span
      v-if="label"
      class="ui-input__label"
    >
      {{ label }}
    </span>

    <input
      v-if="type === 'phone'"
      v-model="model"
      v-imask="'phone'"
      v-bind="$attrs"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="classes"
    />

    <input
      v-else
      v-model="model"
      :type="type"
      v-bind="$attrs"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="classes"
    />

    <span
      v-if="error"
      class="ui-input__error"
    >
      {{ error }}
    </span>
  </label>
</template>

<style lang="scss">
  .ui-input__wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-family: inherit;
  }

  .ui-input__label {
    font-size: 0.9rem;
    color: var(--color-dark-blue);
  }

  .ui-input {
    padding: 0.5rem 0.75rem;
    border: 2px solid #d1d5db;
    border-radius: 0.5rem;
    transition:
      border-color var(--transition-duration) ease,
      box-shadow var(--transition-duration) ease;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }

    &--error {
      border-color: var(--color-error);
    }

    &--disabled {
      background-color: var(--color-white-f9);
      cursor: not-allowed;
      opacity: 0.7;
    }
  }

  .ui-input__error {
    color: var(--color-error);
    font-size: 12px;
  }
</style>
