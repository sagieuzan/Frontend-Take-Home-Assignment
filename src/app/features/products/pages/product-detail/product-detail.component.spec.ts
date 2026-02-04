import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ProductDetailComponent } from './product-detail.component';
import { Location } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

describe('ProductDetailComponent', () => {
    let component: ProductDetailComponent;
    let fixture: ComponentFixture<ProductDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                ProductDetailComponent // Standalone
            ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { paramMap: { get: () => null } }
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProductDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create with an empty form in create mode', () => {
        expect(component.productForm).toBeDefined();
        expect(component.isEditMode).toBeFalse();
        expect(component.productForm.valid).toBeFalse();
    });

    it('should validate required fields', () => {
        const nameControl = component.productForm.get('name');
        nameControl?.setValue('');
        expect(nameControl?.valid).toBeFalse();
        expect(nameControl?.errors?.['required']).toBeTruthy();

        nameControl?.setValue('Ab');
        expect(nameControl?.errors?.['minlength']).toBeTruthy();

        nameControl?.setValue('Valid Name');
        expect(nameControl?.valid).toBeTrue();
    });

    it('should validate price must be positive', () => {
        const priceControl = component.productForm.get('price');
        priceControl?.setValue(0);
        expect(priceControl?.valid).toBeFalse();
        expect(priceControl?.errors?.['min']).toBeTruthy();

        priceControl?.setValue(10);
        expect(priceControl?.valid).toBeTrue();
    });

    it('should be valid when all required fields are filled correctly', () => {
        component.productForm.patchValue({
            name: 'Test Product',
            description: 'Test Description',
            price: 99.99,
            category: 'Electronics',
            stock: 10
        });
        expect(component.productForm.valid).toBeTrue();
    });

    it('should initialize in edit mode when ID is provided', () => {
        const mockProduct = { id: '1', name: 'Edit Me', price: 50, category: 'Electronics', stock: 10, description: 'Desc' } as Product;
        const productService = TestBed.inject(ProductService);
        spyOn(productService, 'getProductById').and.returnValue(of(mockProduct));

        // Manually trigger initialization with ID
        component.productId = '1';
        component.isEditMode = true;
        (component as unknown as { loadProduct: (id: string) => void }).loadProduct('1');

        expect(component.isEditMode).toBeTrue();
        expect(component.productForm.get('name')?.value).toBe('Edit Me');
    });

    it('should navigate back using location', () => {
        const location = TestBed.inject(Location);
        const locationSpy = spyOn(location, 'back');
        component.goBack();
        expect(locationSpy).toHaveBeenCalled();
    });
});
