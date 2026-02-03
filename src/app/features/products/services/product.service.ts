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
    private readonly _loading = signal<boolean>(false);
    private readonly _error = signal<string | null>(null);

    // Publicly exposed readonly signals
    readonly products = this._products.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();

    // Computed signals
    readonly productCount = computed(() => this._products().length);

    constructor() { }

    getProducts(filters: ProductFilters = {}): Observable<Product[]> {
        this._loading.set(true);
        this._error.set(null);

        let params = new HttpParams();

        if (filters.search) params = params.set('q', filters.search);
        if (filters.category) params = params.set('category', filters.category);
        if (filters.minPrice) params = params.set('price_gte', filters.minPrice.toString());
        if (filters.maxPrice) params = params.set('price_lte', filters.maxPrice.toString());

        if (filters.sortBy) {
            params = params.set('_sort', filters.sortBy);
            params = params.set('_order', filters.sortOrder || 'asc');
        }

        if (filters.page) {
            params = params.set('_page', filters.page.toString());
            params = params.set('_limit', filters.limit?.toString() || '10');
        }

        return this.http.get<Product[]>(this.apiUrl, { params }).pipe(
            tap(products => this._products.set(products)),
            catchError(err => {
                const errMsg = 'Failed to load products. Please try again later.';
                this._error.set(errMsg);
                return throwError(() => new Error(errMsg));
            }),
            finalize(() => this._loading.set(false))
        );
    }

    getProductById(id: string): Observable<Product> {
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
        const newProduct = {
            ...product,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        return this.http.post<Product>(this.apiUrl, newProduct).pipe(
            tap(res => {
                this._products.update(prev => [res, ...prev]);
            }),
            catchError(err => {
                this._error.set('Failed to create product.');
                return throwError(() => new Error('Failed to create product.'));
            })
        );
    }

    updateProduct(id: string, updates: ProductUpdate): Observable<Product> {
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
}
