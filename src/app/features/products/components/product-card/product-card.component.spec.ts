import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { Product, ProductCategory } from '../../models/product.model';
import { provideRouter } from '@angular/router';

describe('ProductCardComponent', () => {
    let component: ProductCardComponent;
    let fixture: ComponentFixture<ProductCardComponent>;

    const mockProduct: Product = {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        category: ProductCategory.Electronics,
        stock: 10,
        tags: []
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProductCardComponent],
            providers: [provideRouter([])]
        }).compileComponents();

        fixture = TestBed.createComponent(ProductCardComponent);
        component = fixture.componentInstance;
        component.product = mockProduct;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should use placeholder image when imageUrl is missing', () => {
        component.product = { ...mockProduct, imageUrl: undefined };
        fixture.detectChanges();

        // Check the component property
        expect(component.placeholderImage).toContain('data:image/svg+xml');

        // Check the DOM
        const imgElement = fixture.nativeElement.querySelector('img');
        expect(imgElement.src).toContain('data:image/svg+xml');
    });

    it('should switch to placeholder if image fails to load', () => {
        component.product = { ...mockProduct, imageUrl: 'invalid-url.jpg' };
        fixture.detectChanges();

        const imgElement = fixture.nativeElement.querySelector('img');
        // Simulate error
        imgElement.dispatchEvent(new Event('error'));
        fixture.detectChanges();

        expect(imgElement.src).toContain('data:image/svg+xml');
    });
});
