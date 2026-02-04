import { Component, Output, EventEmitter, inject, OnInit, OnDestroy, Input } from '@angular/core';
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
  @Input() set initialFilters(value: ProductFilters | undefined) {
    if (value) {
      this.filterForm.patchValue(value, { emitEvent: false });
    }
  }
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
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      takeUntil(this.destroy$)
    ).subscribe(values => {
      this.filtersChanged.emit(values);
    });
  }

  onReset() {
    this.filterForm.patchValue({
      search: '',
      category: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
