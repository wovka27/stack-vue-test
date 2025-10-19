<script setup lang="ts">
  import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const page = defineModel<number>('page', { default: 1 });
  const perPage = defineModel<number>('perPage', { required: true, default: 5 });

  const props = defineProps<{ total: number }>();

  const route = useRoute();
  const router = useRouter();
  const width = ref(window.innerWidth);

  const delta = computed(() => (width.value < 480 ? 1 : width.value < 768 ? 2 : 3));
  const totalPages = computed(() => Math.max(1, Math.ceil(props.total / perPage.value)));

  const pages = computed(() => {
    const total = totalPages.value;
    const current = page.value;
    const max = 10;

    if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);

    const half = Math.floor(max / delta.value);
    let start = Math.max(1, current - half);
    const end = Math.min(total, start + max - 1);

    if (end - start < max - 1) start = Math.max(1, end - max + 1);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  const goTo = (p: number) => {
    if (p < 1 || p > totalPages.value || p === page.value) return;
    page.value = p;
  };

  const syncWidth = () => (width.value = window.innerWidth);

  watch([page, perPage], ([p, per]) => {
    router.replace({
      query: {
        ...route.query,
        page: String(p),
        perPage: String(per),
      },
    });
  });

  watch([page, totalPages], ([p, total]) => {
    if (p > total) page.value = total;
  });

  watch(perPage, () => {
    page.value = 1;
  });

  watch(totalPages, (tp) => {
    if (page.value > tp) page.value = tp;
  });

  onMounted(() => {
    const queryPage = Number(route.query.page);
    const queryPerPage = Number(route.query.perPage);

    if (Number.isFinite(queryPerPage) && queryPerPage > 0) perPage.value = queryPerPage;
    if (Number.isFinite(queryPage) && queryPage > 0) page.value = queryPage;

    window.addEventListener('resize', syncWidth, { passive: true });
  });

  onUnmounted(() => window.removeEventListener('resize', syncWidth));
</script>

<template>
  <nav class="pagination">
    <div class="pagination__data">
      <button
        class="pagination__arrow"
        :disabled="page <= 1"
        @click="goTo(page - 1)"
      >
        <UiIcon
          :width="24"
          name="arrow-left"
        />
      </button>

      <button
        v-for="p in pages"
        :key="p"
        class="pagination__item"
        :class="{ 'pagination__item--active': p === page }"
        @click="goTo(Number(p))"
      >
        {{ p }}
      </button>

      <button
        class="pagination__arrow"
        :disabled="page >= totalPages"
        @click="goTo(page + 1)"
      >
        <UiIcon
          :width="24"
          name="arrow-right"
        />
      </button>
    </div>
    <ui-select
      v-model="perPage"
      :options="[
        { value: 5, label: '5' },
        { value: 10, label: '10' },
        { value: 20, label: '20' },
        { value: 50, label: '50' },
        { value: 100, label: '100' },
      ]"
    />
  </nav>
</template>

<style lang="scss">
  .pagination {
    &,
    &__data {
      display: flex;
      align-items: center;
    }
    width: 100%;
    gap: 20px;
    flex-wrap: wrap;
    font-family: sans-serif;
    justify-content: space-between;
    color: var(--color-black);

    &__data {
      gap: 4px;
    }
  }

  .pagination__item {
    min-width: 32px;
    height: 32px;
    padding: 0 6px;
    border-radius: 6px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition:
      background 0.2s,
      color 0.2s;
    font-size: 14px;
    color: var(--color-black);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pagination__item:hover:not(.pagination__item--active) {
    background: rgba(0, 0, 0, 0.05);
  }

  .pagination__item--active {
    background: var(--color-primary);
    color: #fff;
    font-weight: 600;
  }

  .pagination__arrow {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-primary);
    transition: opacity 0.2s;
  }

  .pagination__arrow:hover:not(:disabled) {
    opacity: 0.8;
  }

  .pagination__arrow:disabled {
    opacity: 0.4;
    cursor: default;
  }
</style>
