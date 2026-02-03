import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductFiltersComponent } from '../../components/product-filters/product-filters.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';
import { ProductFilters } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    NgIf, NgFor, AsyncPipe,
    ProductCardComponent,
    ProductFiltersComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    ErrorMessageComponent
  ],
  template: `
    <div class="container fade-in">
      <div class="list-header">
        <div>
          <h1>Products</h1>
          <p class="subtitle">Manage and browse your catalog</p>
        </div>
        <div class="stats" *ngIf="!productService.loading()">
           {{ productService.productCount() }} products found
        </div>
      </div>

      <app-product-filters (filtersChanged)="onFiltersChanged($event)"></app-product-filters>

      <app-loading-spinner *ngIf="productService.loading()"></app-loading-spinner>

      <app-error-message 
        *ngIf="productService.error() && !productService.loading()" 
        [message]="productService.error()!"
        (retry)="loadProducts()">
      </app-error-message>

      <ng-container *ngIf="!productService.loading() && !productService.error()">
        <div class="product-grid" *ngIf="productService.products().length > 0; else empty">
          @for (product of productService.products(); track product.id) {
            <app-product-card [product]="product"></app-product-card>
          }
        </div>
      </ng-container>

      <ng-template #empty>
        <app-empty-state></app-empty-state>
      </ng-template>
    </div>
  `,
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  readonly productService = inject(ProductService);
  private currentFilters: ProductFilters = {};

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts(this.currentFilters).subscribe();
  }

  onFiltersChanged(filters: ProductFilters) {
    this.currentFilters = filters;
    this.loadProducts();
  }
}
