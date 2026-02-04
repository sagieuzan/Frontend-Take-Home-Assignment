import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { ModalService } from '../../../core/services/modal.service';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [CommonModule, A11yModule],
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.scss'
})
export class ModalComponent {
    readonly modalService = inject(ModalService);
}
