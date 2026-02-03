import { Injectable, signal } from '@angular/core';

export interface ModalOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'default' | 'danger' | 'success';
}

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    private _isOpen = signal(false);
    private _options = signal<ModalOptions | null>(null);
    private _confirmCallback: (() => void) | null = null;
    private _cancelCallback: (() => void) | null = null;

    readonly isOpen = this._isOpen.asReadonly();
    readonly options = this._options.asReadonly();

    open(options: ModalOptions): Promise<boolean> {
        this._options.set(options);
        this._isOpen.set(true);

        return new Promise((resolve) => {
            this._confirmCallback = () => {
                this.close();
                resolve(true);
            };
            this._cancelCallback = () => {
                this.close();
                resolve(false);
            };
        });
    }

    confirm() {
        if (this._confirmCallback) this._confirmCallback();
    }

    cancel() {
        if (this._cancelCallback) this._cancelCallback();
    }

    private close() {
        this._isOpen.set(false);
        this._options.set(null);
        this._confirmCallback = null;
        this._cancelCallback = null;
    }
}
