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
  templateUrl: './product-list.component.html',
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
