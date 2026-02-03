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
        req.flush(mockProducts);
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

    it('should create a new product and update state', () => {
        const newProd = { name: 'New', price: 15 } as any;
        const responseProd = { ...newProd, id: '3' } as Product;

        service.createProduct(newProd).subscribe();

        const req = httpMock.expectOne(req => req.url.includes('/products'));
        expect(req.request.method).toBe('POST');
        req.flush(responseProd);

        expect(service.products()).toContain(responseProd);
    });
});
