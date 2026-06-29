import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div 
        *ngFor="let toast of notificationService.toasts()" 
        class="toast" 
        [ngClass]="toast.type"
      >
        <span>{{ toast.message }}</span>
        <button (click)="notificationService.remove(toast.id)">&times;</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .toast {
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-width: 250px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out forwards;
    }
    .toast button {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      margin-left: 15px;
    }
    .success { background-color: #10b981; }
    .error { background-color: #ef4444; }
    .info { background-color: #3b82f6; }
    
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  notificationService = inject(NotificationService);
}
