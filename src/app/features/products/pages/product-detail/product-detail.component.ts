import { Component, inject, OnInit } from '@angular/core';
import { NgIf, NgFor, CurrencyPipe, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product, ProductCategory } from '../../models/product.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="container fade-in">
      <div class="detail-header">
        <button class="btn-back" (click)="goBack()">← Back</button>
        <h1>{{ isEditMode ? 'Edit Product' : 'New Product' }}</h1>
      </div>

      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <div class="form-card card" *ngIf="!loading">
        <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="name">Product Name *</label>
              <input type="text" id="name" formControlName="name" placeholder="Enter product name">
              <div class="error" *ngIf="isFieldInvalid('name')">Name is required (min 3 chars)</div>
            </div>

            <div class="form-group full-width">
              <label for="description">Description *</label>
              <textarea id="description" formControlName="description" rows="4" placeholder="Enter product description"></textarea>
              <div class="error" *ngIf="isFieldInvalid('description')">Description is required</div>
            </div>

            <div class="form-group">
              <label for="price">Price ($) *</label>
              <input type="number" id="price" formControlName="price" placeholder="0.00">
              <div class="error" *ngIf="isFieldInvalid('price')">Price must be greater than 0</div>
            </div>

            <div class="form-group">
              <label for="category">Category *</label>
              <select id="category" formControlName="category">
                <option value="">Select Category</option>
                @for (cat of categories; track cat) {
                  <option [value]="cat">{{ cat }}</option>
                }
              </select>
              <div class="error" *ngIf="isFieldInvalid('category')">Category is required</div>
            </div>

            <div class="form-group">
              <label for="stock">Stock Quantity *</label>
              <input type="number" id="stock" formControlName="stock" placeholder="0">
              <div class="error" *ngIf="isFieldInvalid('stock')">Stock cannot be negative</div>
            </div>

            <div class="form-group">
              <label for="imageUrl">Image URL</label>
              <input type="text" id="imageUrl" formControlName="imageUrl" placeholder="https://example.com/image.jpg">
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="goBack()">Cancel</button>
            <button type="button" class="btn-danger" *ngIf="isEditMode" (click)="onDelete()">Delete Product</button>
            <button type="submit" class="btn-primary" [disabled]="productForm.invalid || saving">
              {{ saving ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly location = inject(Location);

  readonly categories = Object.values(ProductCategory);

  productForm!: FormGroup;
  isEditMode = false;
  loading = false;
  saving = false;
  productId: string | null = null;

  ngOnInit() {
    this.initForm();
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.loadProduct(this.productId);
    }
  }

  private initForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      category: ['', [Validators.required]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      rating: [0]
    });
  }

  private loadProduct(id: string) {
    this.loading = true;
    this.productService.getProductById(id).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (product) => this.productForm.patchValue(product),
      error: () => this.router.navigate(['/products'])
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.productForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    this.saving = true;
    const productData = this.productForm.value;

    const action$ = this.isEditMode
      ? this.productService.updateProduct(this.productId!, productData)
      : this.productService.createProduct(productData);

    action$.pipe(
      finalize(() => this.saving = false)
    ).subscribe({
      next: () => this.router.navigate(['/products']),
      error: (err) => alert(err.message)
    });
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this product?') && this.productId) {
      this.productService.deleteProduct(this.productId).subscribe(() => {
        this.router.navigate(['/products']);
      });
    }
  }

  goBack() {
    this.location.back();
  }
}
