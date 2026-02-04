import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductService } from '../../services/product.service';
import { of } from 'rxjs';
import { ProductFilters } from '../../models/product.model';
import { signal } from '@angular/core';

describe('ProductListComponent', () => {
    let component: ProductListComponent;
    let fixture: ComponentFixture<ProductListComponent>;
    let productService: ProductService;

    beforeEach(async () => {
        // Mock the signals in ProductService
        const mockProducts = signal([]);
        const mockTotalCount = signal(0);
        const mockLoading = signal(false);
        const mockError = signal(null);

        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                ProductListComponent
            ],
            providers: [
                {
                    provide: ProductService,
                    useValue: {
                        getProducts: () => of([]),
                        products: mockProducts,
                        totalCount: mockTotalCount,
                        loading: mockLoading,
                        error: mockError
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProductListComponent);
        component = fixture.componentInstance;
        productService = TestBed.inject(ProductService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call getProducts on init', () => {
        const spy = spyOn(productService, 'getProducts').and.callThrough();
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });

    it('should reset page when filters change', () => {
        component.currentPage = 5;
        const filters: ProductFilters = { search: 'test' };

        component.onFiltersChanged(filters);

        expect(component.currentPage).toBe(1);
        expect(component.currentFilters).toEqual(filters);
    });

    it('should calculate total pages correctly', () => {
        const totalCountSignal = productService.totalCount as any;
        totalCountSignal.set(25);
        component.pageSize = 8;

        expect(component.totalPages).toBe(4);
    });
});
