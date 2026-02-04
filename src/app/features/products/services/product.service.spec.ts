import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {
    let service: ProductService;
    let httpMock: HttpTestingController;

    const mockProducts: Product[] = [
        { id: '1', name: 'P1', price: 10, category: 'Other', stock: 5 } as Product,
        { id: '2', name: 'P2', price: 20, category: 'Other', stock: 10 } as Product
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ProductService]
        });
        service = TestBed.inject(ProductService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should fetch products and update signals', (done) => {
        service.getProducts().subscribe(products => {
            expect(products.length).toBe(2);
            expect(service.products()).toEqual(mockProducts);
            expect(service.loading()).toBe(false);
            done();
        });

        const req = httpMock.expectOne(req => req.url.includes('/products'));
        expect(req.request.method).toBe('GET');
        req.flush(mockProducts, { headers: { 'X-Total-Count': '2' } });
    });

    it('should cache consecutive requests with same parameters', () => {
        // First call
        service.getProducts().subscribe();
        const req = httpMock.expectOne(req => req.url.includes('/products'));
        req.flush(mockProducts);

        // Second call (should return from cache)
        service.getProducts().subscribe(products => {
            expect(products).toEqual(mockProducts);
        });

        httpMock.expectNone(req => req.url.includes('/products'));
    });

    it('should clear cache on create/update/delete', () => {
        // 1. Prime cache
        service.getProducts().subscribe();
        httpMock.expectOne(req => req.url.includes('/products')).flush(mockProducts);

        // 2. Perform mutation (create)
        service.createProduct({ name: 'New' } as any).subscribe();
        httpMock.expectOne(req => req.method === 'POST').flush({ id: '3', name: 'New' });

        // 3. fetch again (should NOT be cached)
        service.getProducts().subscribe();
        httpMock.expectOne(req => req.url.includes('/products') && req.method === 'GET');
    });

    it('should support local state manipulation (Optimistic UI)', () => {
        const product = { id: '99', name: 'Optimistic' } as Product;

        service.addProductLocally(product);
        expect(service.products()).toContain(product);

        service.removeProductLocally('99');
        expect(service.products()).not.toContain(product);
    });

    it('should handle error when fetching products', (done) => {
        service.getProducts().subscribe({
            error: (err) => {
                expect(service.error()).toBe('Failed to load products. Please try again later.');
                expect(service.loading()).toBe(false);
                done();
            }
        });

        const req = httpMock.expectOne(req => req.url.includes('/products'));
        req.error(new ErrorEvent('Network error'));
    });
});
