import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styles: [`
    .main-header {
      background-color: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary);
      cursor: pointer;
      text-decoration: none;
    }
  `]
})
export class AppComponent {
  title = 'Product Management Dashboard';
}
