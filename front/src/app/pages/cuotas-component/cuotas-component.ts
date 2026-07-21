import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CuotasService } from '../../services/cuotas-service';
import { NotificationService } from '../../services/notification.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cuotas',
  templateUrl: './cuotas-component.html',
  styleUrls: ['./cuotas-component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CuotasComponent implements OnInit {
  cuotas: any[] = [];
  isOffline: boolean = false;
  isInjecting: boolean = false;

  // Variables de Modal de Edición
  mostrarModalEditar: boolean = false;
  cuotaEditando: any = null;
  nuevoValor: number = 0;
  nuevaProbabilidad: number = 0;
  isSaving: boolean = false;

  constructor(
    private cuotasService: CuotasService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarCuotas();
  }

  cargarCuotas() {
    this.cuotasService.getCuotas().subscribe({
      next: (data: any) => {
        setTimeout(() => {
          this.cuotas = data;
          this.isOffline = false;
          this.cdr.markForCheck();
        });
      },
      error: (err) => {
        setTimeout(() => {
          this.isOffline = true;
          this.cuotas = [];
          this.cdr.markForCheck();
        });
      }
    });
  }

  // --- Mocks Inyectables al Backend ---
  inyectarMocks() {
    setTimeout(() => { this.isInjecting = true; });
    
    const mocks = [
      { resultado: 'Ganador Local', valor: 1.50, probabilidad: 66, estado: 'ACTIVO', id_mercado: 101 },
      { resultado: 'Empate', valor: 3.20, probabilidad: 31, estado: 'ACTIVO', id_mercado: 102 },
      { resultado: 'Ganador Visita', valor: 2.10, probabilidad: 47, estado: 'ACTIVO', id_mercado: 103 },
      { resultado: 'Ambos Anotan - Sí', valor: 1.85, probabilidad: 54, estado: 'ACTIVO', id_mercado: 104 },
      { resultado: 'Ambos Anotan - No', valor: 1.95, probabilidad: 51, estado: 'ACTIVO', id_mercado: 105 },
      { resultado: 'Más de 2.5 Goles', valor: 1.70, probabilidad: 58, estado: 'ACTIVO', id_mercado: 106 }
    ];

    const peticiones = mocks.map(mock => this.cuotasService.crearCuota(mock));

    forkJoin(peticiones).subscribe({
      next: () => {
        this.notificationService.showSuccess('¡Cuotas base inyectadas en la base de datos!');
        setTimeout(() => {
          this.isInjecting = false;
          this.cargarCuotas(); // Recargar desde el backend
          this.cdr.markForCheck();
        });
      },
      error: (err) => {
        this.notificationService.showError('Error al inyectar cuotas. ¿Está encendido el servidor?');
        setTimeout(() => {
          this.isInjecting = false;
          this.cdr.markForCheck();
        });
      }
    });
  }

  // --- Lógica de Edición ---
  abrirModalEditar(cuota: any) {
    this.cuotaEditando = { ...cuota };
    this.nuevoValor = cuota.valor;
    this.nuevaProbabilidad = cuota.probabilidad;
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar() {
    this.mostrarModalEditar = false;
    this.cuotaEditando = null;
  }

  guardarCuota() {
    if (this.nuevoValor <= 1.0) {
      this.notificationService.showError('El valor de la cuota debe ser mayor a 1.0');
      return;
    }
    if (this.nuevaProbabilidad < 0 || this.nuevaProbabilidad > 100) {
      this.notificationService.showError('La probabilidad debe estar entre 0 y 100');
      return;
    }

    this.isSaving = true;
    this.cuotaEditando.valor = this.nuevoValor;
    this.cuotaEditando.probabilidad = this.nuevaProbabilidad;

    this.cuotasService.actualizarCuota(this.cuotaEditando).subscribe({
      next: (res) => {
        this.notificationService.showSuccess(`Cuota de ${this.cuotaEditando.resultado} actualizada exitosamente.`);
        setTimeout(() => {
          this.isSaving = false;
          this.cerrarModalEditar();
          this.cargarCuotas();
          this.cdr.markForCheck();
        });
      },
      error: (err) => {
        this.notificationService.showError('Ocurrió un error al guardar la cuota.');
        setTimeout(() => {
          this.isSaving = false;
          this.cdr.markForCheck();
        });
      }
    });
  }
}
