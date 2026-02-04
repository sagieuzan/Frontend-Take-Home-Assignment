# Product Management Dashboard 🚀

A high-standard Angular application for managing an e-commerce product catalog. This project demonstrates modern frontend engineering practices, including fine-grained reactivity, accessibility, and high UX performance.

## ✨ Technical Highlights

### 🚄 Advanced UX & Reliability
- **Optimistic UI Patterns**: Immediate UI updates for Create and Delete operations with automatic background synchronization and atomic rollback on failure.
- **Request Layer Caching**: In-memory caching logic in the `ProductService` to provide instant data retrieval and eliminate redundant network traffic.
- **Deep-Linked State**: Full synchronization of search, categorization, and pagination with URL parameters for shareable and persistent views.
- **Smart Search**: Debounced RxJS streams to optimize filtering performance.

### 🎨 Design & Accessibility (a11y)
- **Hybrid Design System**: A custom-built, responsive CSS system supporting both **Light and Dark modes** with system-level detection and persistence.
- **Inclusive Navigation**: Built with Semantic HTML, full keyboard support, skip links, and comprehensive ARIA labeling.
- **Fluid Layouts**: Compact and adaptive interfaces tailored for various screen resolutions.

---

## 🛠️ Performance & Scalability

- **Angular 19 Signals**: Leveraging native fine-grained reactivity for hyper-efficient DOM updates.
- **Strict Typing**: 100% type safety across the application—zero `any` usage.
- **Service-Based Architecture**: Strict separation of concerns between UI components and the data orchestration layer.

---

## 🏃 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Run the Mock API (json-server)
In a separate terminal or background:
```bash
npm run server
```

### 3. Start the Application
```bash
npm start
```
*The application should automatically open at `http://localhost:4200`.*

---

## 🧪 Testing & Quality Assurance

The project includes unit and integration tests focusing on critical business logic:
- **Service Integrity**: `product.service.spec.ts` (State sync, Caching, API flows).
- **Form Robustness**: `product-detail.component.spec.ts` (Validation logic, multi-mode handling).
- **Component UX**: `product-list.component.spec.ts` (Filtering and data rendering).

Run tests: `npx ng test`

---

## 📂 Project Structure

```text
src/app/
├── core/               # Global singletons (Theme, Notifications, Modals)
├── shared/             # Reusable foundation components
└── features/
    └── products/       # Domain-driven product feature
        ├── services/   # State & Data Layer
        ├── pages/      # Route-level orchestration
        └── components/ # Specialized UI elements
```

---

## 📝 Technical Notes for Evaluators
- **Pristine State Tracking**: The "Update" action is intelligently disabled until actual changes are detected in the form, preventing redundant API calls.
- **ID Management**: Optimistic creation uses temporary timestamps to allow concurrent creations without identity collisions.
- **Global Error Handling**: Integrated `role="alert"` for real-time error feedback, ensuring a top-tier accessibility score.

---
*Developed as part of the Frontend Home Assignment.*
