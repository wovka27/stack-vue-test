<script setup lang="ts">
  import { computed } from 'vue';

  interface UiSelectOption {
    label: string;
    value: string | number;
  }

  interface UiSelectProps {
    label?: string;
    error?: string;
    disabled?: boolean;
    options: UiSelectOption[];
    placeholder?: string;
  }

  const props = withDefaults(defineProps<UiSelectProps>(), {
    label: '',
    error: '',
    disabled: false,
    placeholder: 'Выберите...',
  });

  const model = defineModel<string | number>({ required: true });

  const classes = computed(() => [
    'ui-select',
    { 'ui-select--error': !!props.error },
    { 'ui-select--disabled': props.disabled },
  ]);
</script>

<template>
  <label class="ui-select__wrapper">
    <span
      v-if="label"
      class="ui-select__label"
    >
      {{ label }}
    </span>

    <div class="ui-select__container">
      <select
        v-model="model"
        :disabled="disabled"
        :class="classes"
      >
        <option
          disabled
          value=""
          hidden
        >
          {{ placeholder }}
        </option>

        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <span class="ui-select__arrow">▼</span>
    </div>

    <span
      v-if="error"
      class="ui-select__error"
    >
      {{ error }}
    </span>
  </label>
</template>

<style lang="scss">
  .ui-select__wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-family: inherit;
  }

  .ui-select__label {
    font-size: 0.9rem;
    color: var(--color-dark-blue);
  }

  .ui-select__container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .ui-select {
    appearance: none;
    width: 100%;
    padding: 0.5rem 2rem 0.5rem 0.75rem;
    border: 2px solid #d1d5db;
    border-radius: 0.5rem;
    background-color: white;
    font-size: 1rem;
    color: #111827;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }

    &:hover:not(:disabled) {
      border-color: #9ca3af;
    }

    &--error {
      border-color: #ef4444;
    }

    &--disabled {
      background-color: var(--color-white-f9);
      cursor: not-allowed;
      opacity: 0.7;
    }
  }

  .ui-select__arrow {
    position: absolute;
    right: 0.75rem;
    pointer-events: none;
    color: #6b7280;
    font-size: 0.8rem;
  }

  .ui-select__error {
    color: #ef4444;
    font-size: 0.85rem;
  }
</style>
