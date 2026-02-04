import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  currentFilters: ProductFilters = {};
  currentPage = 1;
  pageSize = 8;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentPage = params['page'] ? parseInt(params['page'], 10) : 1;
      this.currentFilters = {
        search: params['search'] || '',
        category: params['category'] || '',
        sortBy: params['sortBy'] || 'createdAt',
        sortOrder: params['sortOrder'] || 'desc'
      };
      this.loadProducts();
    });
  }

  loadProducts() {
    this.productService.getProducts({ ...this.currentFilters, page: this.currentPage, limit: this.pageSize }).subscribe();
  }

  onFiltersChanged(filters: ProductFilters) {
    this.updateUrl({ ...filters, page: 1 });
  }

  onPageChange(page: number) {
    this.updateUrl({ ...this.currentFilters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private updateUrl(params: Partial<ProductFilters>) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge'
    });
  }

  get totalPages(): number {
    return Math.ceil(this.productService.totalCount() / this.pageSize);
  }

  get pages(): number[] {
    const total = this.totalPages;
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // Helpers for template access
  get loading() { return this.productService.loading(); }
  get error() { return this.productService.error(); }
  get products() { return this.productService.products(); }
  get productCount() { return this.productService.totalCount(); }
}
