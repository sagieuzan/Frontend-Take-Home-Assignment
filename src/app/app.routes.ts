import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'products',
        loadComponent: () => import('./features/products/pages/product-list/product-list.component').then(m => m.ProductListComponent)
    },
    {
        path: 'products/new',
        loadComponent: () => import('./features/products/pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
    },
    {
        path: 'products/:id',
        loadComponent: () => import('./features/products/pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
    },
    {
        path: '',
        redirectTo: '/products',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/products'
    }
];
