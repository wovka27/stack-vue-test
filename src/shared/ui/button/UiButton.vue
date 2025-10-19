<script setup lang="ts">
  import { computed } from 'vue';

  interface UiButtonProps {
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
  }

  const props = withDefaults(defineProps<UiButtonProps>(), {
    type: 'button',
    variant: 'primary',
    size: 'md',
    disabled: false,
  });

  const emit = defineEmits<{ (e: 'click', event: MouseEvent): void }>();

  const classes = computed(() => [
    'ui-button',
    `ui-button--${props.variant}`,
    `ui-button--${props.size}`,
    { 'ui-button--disabled': props.disabled },
  ]);
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="classes"
    v-bind="$attrs"
    @click="(e) => !disabled && emit('click', e)"
  >
    <slot />
  </button>
</template>

<style lang="scss">
  .ui-button {
    cursor: pointer;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    transition-property: color, background-color, transform;

    &--sm {
      padding: 0.25rem 0.75rem;
      font-size: 0.85rem;
    }
    &--md {
      padding: 0.5rem 1rem;
      font-size: 1rem;
    }
    &--lg {
      padding: 0.75rem 1.25rem;
      font-size: 1.125rem;
    }

    &--primary {
      background-color: var(--color-primary);
      color: #fff;
      &:hover {
        background-color: var(--color-primary-hover);
      }
    }

    &--secondary {
      background-color: #e5e7eb;
      color: #111827;
      &:hover {
        background-color: #d1d5db;
      }
    }

    &--outline {
      background: transparent;
      border: 2px solid var(--color-primary);
      color: var(--color-primary);
      &:hover {
        background: var(--color-primary);
        color: #fff;
      }
    }

    &--danger {
      background-color: #ef4444;
      color: #fff;
      &:hover {
        background-color: #dc2626;
      }
    }

    &--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &:active:not(&--disabled) {
      transform: scale(0.97);
    }
  }
</style>
