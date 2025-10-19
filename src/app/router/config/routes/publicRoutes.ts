import type { RouteRecordRaw } from 'vue-router';

export const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/main'),
    meta: {
      layout: true,
      title: 'Смотреть аниме онлайн',
      nlmt: true,
    },
  },
];
