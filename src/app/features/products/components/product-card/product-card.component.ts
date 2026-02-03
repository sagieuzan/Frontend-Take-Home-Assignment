import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, NgIf } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, NgIf],
  template: `
    <div class="product-card card" [routerLink]="['/products', product.id]">
      <div class="product-image">
        <img [src]="product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'" [alt]="product.name">
        <span class="category-badge">{{ product.category }}</span>
      </div>
      <div class="product-info">
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-description">{{ product.description }}</p>
        <div class="product-footer">
          <span class="product-price">{{ product.price | currency }}</span>
          <span class="product-stock" [class.out-of-stock]="product.stock === 0">
            {{ product.stock > 0 ? product.stock + ' in stock' : 'Out of stock' }}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
    .product-card {
      height: 100%;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }
    .product-image {
      position: relative;
      height: 200px;
      background-color: #f1f5f9;
    }
    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .category-badge {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      background: rgba(255, 255, 255, 0.9);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--primary);
    }
    .product-info {
      padding: 1.25rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .product-name {
      font-size: 1.125rem;
      margin-bottom: 0.5rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .product-description {
      color: var(--text-muted);
      font-size: 0.875rem;
      margin-bottom: 1rem;
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
    }
    .product-price {
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--text);
    }
    .product-stock {
      font-size: 0.75rem;
      color: var(--success);
      font-weight: 500;
    }
    .product-stock.out-of-stock {
      color: var(--danger);
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
}
