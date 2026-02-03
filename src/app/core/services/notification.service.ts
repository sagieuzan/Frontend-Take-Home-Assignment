import { Injectable, signal } from '@angular/core';

export interface Notification {
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private _notifications = signal<Notification[]>([]);
    readonly notifications = this._notifications.asReadonly();

    show(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) {
        const notification: Notification = { message, type, duration };
        this._notifications.update(prev => [...prev, notification]);

        setTimeout(() => {
            this.remove(notification);
        }, duration);
    }

    success(message: string) {
        this.show(message, 'success');
    }

    error(message: string) {
        this.show(message, 'error');
    }

    private remove(notification: Notification) {
        this._notifications.update(prev => prev.filter(n => n !== notification));
    }
}
