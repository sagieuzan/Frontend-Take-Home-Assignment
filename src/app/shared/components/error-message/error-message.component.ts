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
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent {
  @Input() message: string = 'An unexpected error occurred.';
  @Output() retry = new EventEmitter<void>();
}
