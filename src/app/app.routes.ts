import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login';
import { CatalogComponent } from './pages/catalog/catalog';

import {
  ProductAdminComponent
} from './pages/admin/product-list/product-list';

import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'catalog',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'catalog',
    component: CatalogComponent,
    canActivate: [authGuard]
  },

  {
    path: 'admin',
    component: ProductAdminComponent,
    canActivate: [authGuard, adminGuard]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];