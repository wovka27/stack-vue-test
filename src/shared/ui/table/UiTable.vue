<script setup lang="ts" generic="T">
  import { computed, toRefs, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import QueryHelper, { type Params } from '@shared/lib/query-helpers';
  import UiPagination from '@shared/ui/pagination/UiPagination.vue';
  import type { IClickItemValue, ITableProps, SortState } from '@shared/ui/table/model';

  const props = withDefaults(defineProps<ITableProps<T>>(), {
    striped: true,
    hover: true,
    page: 1,
    perPage: 10,
  });

  const emit = defineEmits<{
    (e: 'clickItem', payload: IClickItemValue): void;
  }>();

  const page = defineModel<number>('page', { default: 1 });
  const perPage = defineModel<number>('perPage', { default: 10 });
  const sort = defineModel<SortState>('sort', { default: () => ({ key: '', direction: null }) });

  const route = useRoute();
  const router = useRouter();

  const { rows, columns, clickableItem, actions, striped, hover } = toRefs(props);

  const paginatedRows = computed(() => {
    const start = (page.value - 1) * perPage.value;
    const end = start + perPage.value;
    return rows.value.slice(start, end);
  });

  const sortedRows = computed(() => {
    const { key, direction } = sort.value;
    if (!key || !direction) return paginatedRows.value;

    return [...paginatedRows.value].sort((a, b) => {
      const va = a[key];
      const vb = b[key];
      if (va === vb) return 0;

      if (typeof va === 'number' && typeof vb === 'number') {
        return direction === 'asc' ? va - vb : vb - va;
      }

      return direction === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  });

  const setPage = (value: number) => {
    page.value = value;
  };

  const handleClickItem = (value: IClickItemValue) => {
    if (!clickableItem.value) return;
    emit('clickItem', value);
  };

  const toggleSort = (colKey: string) => {
    const { key, direction } = sort.value;
    let newDirection: SortState['direction'] = 'asc';

    if (key === colKey) {
      if (direction === 'asc') newDirection = 'desc';
      else if (direction === 'desc') newDirection = null;
    }

    sort.value = { key: colKey, direction: newDirection };
  };

  watch(
    sort,
    (s) => {
      router.push({
        query: QueryHelper.toQueryRecord({
          ...route.query,
          ...(s.direction !== null && {
            ...QueryHelper.toQueryRecord({ sort: { [s.key]: s.direction } } as unknown as Params),
          }),
        }),
      });
    },
    { immediate: true }
  );

  watch(
    () => route.query,
    (s) => {
      const result = QueryHelper.flatten(s as unknown as Params) as unknown as { sort: SortState };

      Object.entries(result.sort).forEach(([key, value]) => {
        sort.value = { key, direction: value };
      });
    },
    { immediate: true, once: true }
  );
</script>

<template>
  <div class="ui-table__wrapper">
    <div class="ui-table">
      <table>
        <thead>
          <tr>
            <template
              v-for="(col, idx) in columns"
              :key="col.key"
            >
              <th
                :class="['ui-table__th', { sortable: col.sortable }]"
                @click="col.sortable && toggleSort(col.key)"
              >
                <slot
                  :name="`head-${col.key}-${idx}`"
                  :col="col"
                >
                  {{ col.label }}
                </slot>
                <span
                  v-if="sort.key === col.key && col.sortable"
                  class="sort-indicator"
                >
                  {{ sort.direction === 'asc' ? '▲' : sort.direction === 'desc' ? '▼' : '' }}
                </span>
              </th>
              <th
                v-if="actions && idx === columns.length - 1"
                width="80"
              />
            </template>
          </tr>
        </thead>

        <tbody>
          <template v-if="sortedRows.length">
            <tr
              v-for="(row, i) in sortedRows"
              :key="row.id ?? i"
              :class="{
                'ui-table__row--striped': striped && i % 2,
                'ui-table__row--hover': hover,
                clickable: clickableItem,
              }"
              @click="handleClickItem({ row, index: i })"
            >
              <template
                v-for="(col, idx) in columns"
                :key="col.key"
              >
                <td>
                  <slot
                    :name="`col-${col.key}`"
                    :col="col"
                    :row="row"
                  >
                    {{ row[col.key] }}
                  </slot>
                </td>
                <td
                  v-if="actions && idx === columns.length - 1"
                  width="80"
                >
                  <div class="ui-table__actions">
                    <slot
                      name="actions"
                      :row="row"
                    />
                  </div>
                </td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div class="ui-table__pagination">
      <ui-pagination
        v-if="rows.length"
        v-model:page="page"
        v-model:per-page="perPage"
        :total="rows.length"
        @set-page="setPage"
      />
    </div>
  </div>
</template>

<style lang="scss">
  .ui-table__wrapper {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .ui-table {
    @include hide-scroll();
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    position: relative;
    overflow: auto;
    display: flex;
    border-collapse: collapse;
    font-size: 0.95rem;
    height: 100%;
    max-height: max-content;

    table {
      width: 100%;
    }

    tbody {
      &:empty {
        position: relative;
        height: 30vh;

        &:before {
          @include flex-center();
          position: absolute;
          content: 'Список пуст...';
          inset: 0;
        }
      }
    }

    thead {
      position: sticky;
      top: 0;
      left: 0;
      width: 100%;
    }
    tr {
      &.clickable {
        cursor: pointer;
      }
    }
    th,
    td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    th {
      background-color: #f9fafb;
      font-weight: 600;
      color: #374151;
    }
    .ui-table__row--striped {
      background-color: #f3f4f6;
    }
    .ui-table__row--hover:hover {
      background-color: #e0f2fe;
    }
    &__empty {
      height: 30vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .ui-table {
    &__pagination {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
  .ui-table__th {
    user-select: none;
    cursor: pointer;
    transition: color 0.2s ease;

    &.sortable:hover {
      color: #2563eb;
    }

    &.active {
      color: #1d4ed8;
    }

    .sort-indicator {
      margin-left: 4px;
      font-size: 0.8rem;
    }
  }
</style>
