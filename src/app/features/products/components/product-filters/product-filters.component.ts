import { Component, Output, EventEmitter, inject, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ProductFilters, ProductCategory } from '../../models/product.model';

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="filters-card card">
      <form [formGroup]="filterForm" class="filter-form">
        <div class="form-group search">
          <label for="search">Search</label>
          <input type="text" id="search" formControlName="search" placeholder="Search products...">
        </div>
        
        <div class="form-group">
          <label for="category">Category</label>
          <select id="category" formControlName="category">
            <option value="">All Categories</option>
            @for (cat of categories; track cat) {
              <option [value]="cat">{{ cat }}</option>
            }
          </select>
        </div>

        <div class="form-group">
          <label for="sortBy">Sort By</label>
          <select id="sortBy" formControlName="sortBy">
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="createdAt">Newest</option>
            <option value="stock">Stock</option>
          </select>
        </div>

        <div class="form-group">
          <label for="sortOrder">Order</label>
          <select id="sortOrder" formControlName="sortOrder">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .filters-card {
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    .filter-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      align-items: flex-end;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .form-group label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-muted);
    }
    .form-group input, .form-group select {
      padding: 0.625rem;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      font-size: 0.9375rem;
      background: var(--surface);
      color: var(--text);
    }
    .form-group input:focus, .form-group select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
    }
    @media (max-width: 640px) {
      .filter-form {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductFiltersComponent implements OnInit, OnDestroy {
  @Output() filtersChanged = new EventEmitter<ProductFilters>();

  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  readonly categories = Object.values(ProductCategory);

  readonly filterForm: FormGroup = this.fb.group({
    search: [''],
    category: [''],
    sortBy: ['createdAt'],
    sortOrder: ['desc']
  });

  ngOnInit() {
    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(values => {
      this.filtersChanged.emit(values);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
