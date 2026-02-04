import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, finalize, BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product, ProductCreate, ProductUpdate, ProductFilters } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:3000/products';

    // Reactive State 
    private readonly _products = signal<Product[]>([]);
    private readonly _totalCount = signal<number>(0);
    private readonly _loading = signal<boolean>(false);
    private readonly _error = signal<string | null>(null);

    // Publicly exposed readonly signals
    readonly products = this._products.asReadonly();
    readonly totalCount = this._totalCount.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();

    // Computed signals
    readonly productCount = computed(() => this._products().length);

    // Cache storage
    private cache = new Map<string, { products: Product[], total: number }>();

    constructor() { }

    getProducts(filters: ProductFilters = {}): Observable<Product[]> {
        const params = this.buildParams(filters);
        const cacheKey = params.toString();

        // 1. Check Cache
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey)!;
            this._products.set(cached.products);
            this._totalCount.set(cached.total);
            return of(cached.products);
        }

        this._loading.set(true);
        this._error.set(null);

        return this.http.get<Product[]>(this.apiUrl, { params, observe: 'response' }).pipe(
            tap(response => {
                const total = parseInt(response.headers.get('X-Total-Count') || '0', 10) || response.body?.length || 0;
                const products = response.body || [];

                // 2. Save to Cache
                this.cache.set(cacheKey, { products, total });

                this._totalCount.set(total);
                this._products.set(products);
            }),
            map(response => response.body || []),
            catchError(err => {
                const errMsg = 'Failed to load products. Please try again later.';
                this._error.set(errMsg);
                return throwError(() => new Error(errMsg));
            }),
            finalize(() => this._loading.set(false))
        );
    }

    private buildParams(filters: ProductFilters): HttpParams {
        let params = new HttpParams();
        if (filters.search) params = params.set('q', filters.search);
        if (filters.category) params = params.set('category', filters.category);
        if (filters.minPrice) params = params.set('price_gte', filters.minPrice.toString());
        if (filters.maxPrice) params = params.set('price_lte', filters.maxPrice.toString());
        if (filters.sortBy) {
            params = params.set('_sort', filters.sortBy);
            params = params.set('_order', filters.sortOrder || 'asc');
        }
        const page = filters.page || 1;
        const limit = filters.limit || 8;
        params = params.set('_page', page.toString());
        params = params.set('_limit', limit.toString());
        return params;
    }

    private clearCache() {
        this.cache.clear();
    }

    getProductById(id: string): Observable<Product> {
        // First check if product exists in current local state
        const localProduct = this._products().find(p => p.id === id);
        if (localProduct) return of(localProduct);

        this._loading.set(true);
        return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
            catchError(err => {
                this._error.set('Product not found.');
                return throwError(() => new Error('Product not found.'));
            }),
            finalize(() => this._loading.set(false))
        );
    }

    createProduct(product: ProductCreate): Observable<Product> {
        this.clearCache();
        const tempId = `temp-${Date.now()}`;
        const optimisticProduct: Product = {
            ...product,
            id: tempId,
            isOptimistic: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // 1. Optimistic Update
        this._products.update(prev => [optimisticProduct, ...prev]);

        return this.http.post<Product>(this.apiUrl, product).pipe(
            tap(res => {
                // 2. Replace temp with real
                this._products.update(prev =>
                    prev.map(p => p.id === tempId ? { ...res, isOptimistic: false } : p)
                );
            }),
            catchError(err => {
                // 3. Rollback
                this._products.update(prev => prev.filter(p => p.id !== tempId));
                this._error.set('Failed to create product.');
                return throwError(() => new Error('Failed to create product.'));
            })
        );
    }

    updateProduct(id: string, updates: ProductUpdate): Observable<Product> {
        this.clearCache();
        const updatedData = {
            ...updates,
            updatedAt: new Date().toISOString()
        };

        return this.http.patch<Product>(`${this.apiUrl}/${id}`, updatedData).pipe(
            tap(res => {
                this._products.update(prev =>
                    prev.map(p => p.id === id ? res : p)
                );
            }),
            catchError(err => {
                this._error.set('Failed to update product.');
                return throwError(() => new Error('Failed to update product.'));
            })
        );
    }

    deleteProduct(id: string): Observable<void> {
        this.clearCache();
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                this._products.update(prev => prev.filter(p => p.id !== id));
            }),
            catchError(err => {
                this._error.set('Failed to delete product.');
                return throwError(() => new Error('Failed to delete product.'));
            })
        );
    }

    // Support for Optimistic UI
    removeProductLocally(id: string) {
        this._products.update(prev => prev.filter(p => p.id !== id));
    }

    addProductLocally(product: Product) {
        this._products.update(prev => [product, ...prev]);
    }
}
