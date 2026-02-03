import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ModalComponent } from './shared/components/modal/modal.component';
import { NotificationComponent } from './shared/components/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ModalComponent, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Product Management Dashboard';
}
