import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería agregar una notificación de éxito', () => {
    // Act
    service.showSuccess('Operación exitosa');
    
    // Assert
    const toasts = service.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].message).toBe('Operación exitosa');
    expect(toasts[0].type).toBe('success');
  });

  it('debería agregar una notificación de error', () => {
    // Act
    service.showError('Ocurrió un error');
    
    // Assert
    const toasts = service.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].message).toBe('Ocurrió un error');
    expect(toasts[0].type).toBe('error');
  });

  it('debería remover una notificación por ID', () => {
    // Arrange
    service.showSuccess('Mensaje 1');
    service.showError('Mensaje 2');
    const idToRemove = service.toasts()[0].id;

    // Act
    service.remove(idToRemove);

    // Assert
    const toasts = service.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].message).toBe('Mensaje 2');
  });
});
