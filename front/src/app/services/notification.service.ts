import { Injectable, signal } from '@angular/core';

export interface ToastNotification {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  toasts = signal<ToastNotification[]>([]);
  private idCounter = 0;

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = this.idCounter++;
    
    // Defer update to avoid NG0100 ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.toasts.update(current => [...current, { message, type, id }]);
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }

  showSuccess(message: string) {
    this.show(message, 'success');
  }

  showError(message: string) {
    this.show(message, 'error');
  }

  remove(id: number) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
