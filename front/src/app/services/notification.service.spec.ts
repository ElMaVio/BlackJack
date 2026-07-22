import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería agregar una notificación de éxito', async () => {
    service.showSuccess('Operación exitosa');
    await delay(10);
    const toasts = service.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].message).toBe('Operación exitosa');
    expect(toasts[0].type).toBe('success');
  });

  it('debería agregar una notificación de error', async () => {
    service.showError('Ocurrió un error');
    await delay(10);
    const toasts = service.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].message).toBe('Ocurrió un error');
    expect(toasts[0].type).toBe('error');
  });

  it('debería remover una notificación por ID', async () => {
    service.showSuccess('Mensaje 1');
    service.showError('Mensaje 2');
    await delay(10);
    const idToRemove = service.toasts()[0].id;

    service.remove(idToRemove);
    await delay(10);
    const toasts = service.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].message).toBe('Mensaje 2');
  });
});
