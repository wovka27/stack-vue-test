import type { RouteRecordRaw } from 'vue-router';
import { publicRoutes } from '@app/router/config/routes/publicRoutes.ts';

export const routes: RouteRecordRaw[] = [...publicRoutes];
