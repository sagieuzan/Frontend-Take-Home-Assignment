import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  template: `
    <div class="error-container">
      <div class="error-card card">
        <h3>Something went wrong</h3>
        <p>{{ message }}</p>
        <button class="btn-primary" (click)="retry.emit()">Retry</button>
      </div>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }
    .error-card {
      padding: 2rem;
      border-color: var(--danger);
      text-align: center;
      max-width: 400px;
    }
    h3 {
      color: var(--danger);
      margin-bottom: 0.5rem;
    }
    p {
      margin-bottom: 1.5rem;
      color: var(--text-muted);
    }
  `]
})
export class ErrorMessageComponent {
  @Input() message: string = 'An unexpected error occurred.';
  @Output() retry = new EventEmitter<void>();
}
