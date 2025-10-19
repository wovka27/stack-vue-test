<script setup lang="ts">
  import { ref, watch } from 'vue';

  const emit = defineEmits<{
    (event: 'onCancel'): void;
  }>();

  const model = defineModel<boolean>({
    default: false,
    set: (val: boolean) => {
      if (!val) emit('onCancel');
      return val;
    },
  });

  const dialogRef = ref<HTMLDialogElement | null>(null);

  const closeModal = () => {
    if (!dialogRef.value) return;

    dialogRef.value.close();
    model.value = false;
  };

  const onClick = (e: MouseEvent) => {
    const dialog = dialogRef.value;

    if (!dialog) return;

    const rect = dialog.getBoundingClientRect();
    const isBackdropClick =
      e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom;

    if (isBackdropClick) closeModal();
  };

  const onOpen = () => dialogRef.value?.showModal();

  watch(
    [model, dialogRef],
    ([v, dialog]) => {
      if (v && dialog) onOpen();
    },
    { immediate: true }
  );

  defineExpose({ close: closeModal, open: onOpen });
</script>

<template>
  <teleport to="body">
    <dialog
      v-if="model"
      ref="dialogRef"
      class="base-modal"
      @click="onClick"
      @cancel="$emit('onCancel')"
    >
      <header class="base-modal-header">
        <slot name="header" />
      </header>
      <main class="base-modal-body">
        <slot
          name="body"
          :close="closeModal"
        />
      </main>
      <footer class="base-modal-footer">
        <slot
          name="footer"
          :close="closeModal"
        />
      </footer>
    </dialog>
  </teleport>
</template>

<style lang="scss">
  .base-modal {
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    padding: 20px;
    border: none;
    border-radius: 15px;
    transition-duration: var(--transition-duration);
    transition-property: scale;
    scale: 1;

    @starting-style {
      scale: 0;
    }

    &::backdrop {
      background-color: #0008;
      opacity: 1;
      transition-duration: var(--transition-duration);
      transition-property: all;

      @starting-style {
        opacity: 0;
      }
    }
  }

  .base-modal__title {
    color: var(--color-dark);
    font-size: 20px;
    font-weight: 500;
    line-height: 100%;
  }

  .base-modal-footer {
    width: 100%;
    display: flex;
    &:empty {
      display: none;
    }
  }
</style>
