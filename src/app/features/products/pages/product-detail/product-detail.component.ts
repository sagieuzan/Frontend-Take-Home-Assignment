import { Component, inject, OnInit } from '@angular/core';
import { NgIf, NgFor, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product, ProductCategory } from '../../models/product.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ModalService } from '../../../../core/services/modal.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly location = inject(Location);
  private readonly modalService = inject(ModalService);
  private readonly notificationService = inject(NotificationService);

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
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const productData = this.productForm.value;

    const action$ = this.isEditMode
      ? this.productService.updateProduct(this.productId!, productData)
      : this.productService.createProduct(productData);

    action$.pipe(
      finalize(() => this.saving = false)
    ).subscribe({
      next: () => {
        this.notificationService.success(this.isEditMode ? 'Product updated successfully!' : 'Product created successfully!');
        this.router.navigate(['/products']);
      },
      error: (err) => this.notificationService.error(err.message)
    });
  }

  async onDelete() {
    const confirmed = await this.modalService.open({
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger'
    });

    if (confirmed && this.productId) {
      this.productService.deleteProduct(this.productId).subscribe({
        next: () => {
          this.notificationService.success('Product deleted successfully');
          this.router.navigate(['/products']);
        },
        error: (err) => this.notificationService.error('Failed to delete product')
      });
    }
  }

  goBack() {
    this.location.back();
  }
}
