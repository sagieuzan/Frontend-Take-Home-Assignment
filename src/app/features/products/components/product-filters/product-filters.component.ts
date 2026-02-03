import { Component, Output, EventEmitter, inject, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ProductFilters, ProductCategory } from '../../models/product.model';

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-filters.component.html',
  styleUrl: './product-filters.component.scss'
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
