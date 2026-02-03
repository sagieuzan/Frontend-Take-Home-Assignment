# Product Management Dashboard

A modern Angular application for managing an e-commerce product catalog.

## Features

- **Product Listing**: View all products with real-time search, category filtering, and sorting.
- **Product Management**: Create, edit, and delete products.
- **Reactive Forms**: Robust form handling with real-time validation.
- **State Management**: Built using Angular Signals for efficient, fine-grained reactivity.
- **Responsive Design**: Premium look and feel with a custom CSS design system and dark mode support.
- **User Feedback**: Clear loading states, empty states, and error handling.

## Tech Stack

- **Angular 19** (Standalone components, Signals, HttpClient)
- **RxJS** (Reactive data streams, debounce search)
- **JSON Server** (Mock API backend)
- **Vanilla CSS** (Custom design system with variables)

## Prerequisites

- Node.js (v18+)
- npm

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the mock backend:**
   ```bash
   npx json-server --watch db.json --port 3000
   ```

3. **Start the Angular application:**
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:4200`.

## Project Structure

- `src/app/core/`: Global services and configuration.
- `src/app/shared/`: Reusable UI components (Spinner, EmptyState, Error).
- `src/app/features/products/`: Main product management feature.
  - `components/`: Feature-specific UI (ProductCard, Filters).
  - `pages/`: Route-level components.
  - `services/`: Product data access and state.
  - `models/`: Type definitions and interfaces.

## Running Tests

- **Run all tests:**
  ```bash
  npx ng test
  ```
- **Service Tests**: `product.service.spec.ts`
- **Form Validation Tests**: `product-detail.component.spec.ts`

## Design Decisions

- **Feature-Based Structure**: Organized by features for better scalability.
- **Angular Signals**: Used instead of complex state management libraries for a native Angular experience.
- **Tailored CSS**: Avoided frameworks like Tailwind to demonstrate strong Vanilla CSS skills and design consistency.
- **Optimistic UI Styling**: Used CSS animations for smooth transitions.
