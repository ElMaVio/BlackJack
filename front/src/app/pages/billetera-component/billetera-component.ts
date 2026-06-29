import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BilleteraService } from '../../services/billetera-service';
import { NotificationService } from '../../services/notification.service';

export interface Billetera {
  estado: string;
  fecha_creacion: string;
  id_billetera: number;
  id_usuario: number;
  moneda: string;
  saldo: number;
  saldo_bloqueado: number;
}

@Component({
  selector: 'app-billetera-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './billetera-component.html',
  styleUrl: './billetera-component.scss',
})
export class BilleteraComponent implements OnInit {
  private billeteraService = inject(BilleteraService);
  private cdr = inject(ChangeDetectorRef);
  private notificationService = inject(NotificationService);

  billeteras: Billetera[] = [];
  cargando: boolean = true;
  filtroActivo: string = 'todas';

  billeteraSeleccionada: Billetera | null = null;
  mostrarModal: boolean = false;
  mostrarModalCrear: boolean = false;

  nuevaBilletera = {
    id_usuario: 1001,
    saldo: 0,
    saldo_bloqueado: 0,
    moneda: 'USD',
    estado: 'activo'
  };

  get billeterasFiltradas(): Billetera[] {
    if (this.filtroActivo === 'todas') return this.billeteras;
    return this.billeteras.filter(b => b.estado === this.filtroActivo);
  }

  get totalSaldos(): number {
    return this.billeteras
      .filter(b => b.estado === 'activo')
      .reduce((acc, b) => acc + b.saldo, 0);
  }

  get totalBloqueado(): number {
    return this.billeteras.reduce((acc, b) => acc + b.saldo_bloqueado, 0);
  }

  get billeterasActivas(): number {
    return this.billeteras.filter(b => b.estado === 'activo').length;
  }

  setFiltro(filtro: string): void {
    this.filtroActivo = filtro;
    this.cdr.detectChanges();
  }

  abrirModalCrear(): void {
    this.nuevaBilletera = { id_usuario: 1001, saldo: 0, saldo_bloqueado: 0, moneda: 'USD', estado: 'activo' };
    this.mostrarModalCrear = true;
    this.cdr.detectChanges();
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
  }

  abrirDetalle(billetera: Billetera): void {
    this.billeteraSeleccionada = { ...billetera };
    this.mostrarModal = true;
    this.cdr.detectChanges();
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.billeteraSeleccionada = null;
    this.cdr.detectChanges();
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  // ============================================================
  // OPERACIONES CRUD (ACCIONES DEL BACKEND)
  // ============================================================

  // 1. Guardar nueva billetera (CREATE)
  crear(): void {
    this.billeteraService.crearBilletera(this.nuevaBilletera).subscribe({
      next: (billeteraCreada) => {
        this.billeteras.push(billeteraCreada); // Agrega la billetera devuelta por Java a la grilla
        this.notificationService.showSuccess('Billetera creada exitosamente');
        this.cerrarModalCrear();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al crear billetera:', error);
        this.notificationService.showError('Error al crear billetera');
      }
    });
  }

  // 2. Guardar edición de saldos o estado (UPDATE)
  editar(): void {
    if (!this.billeteraSeleccionada) return;

    this.billeteraService.editarBilletera(this.billeteraSeleccionada).subscribe({
      next: (billeteraActualizada) => {
        const index = this.billeteras.findIndex(b => b.id_billetera === billeteraActualizada.id_billetera);
        if (index !== -1) {
          this.billeteras[index] = billeteraActualizada;
        }
        this.notificationService.showSuccess('Billetera actualizada exitosamente');
        this.cerrarModal();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al actualizar billetera:', error);
        this.notificationService.showError('Error al actualizar billetera');
      }
    });
  }

  // 3. Eliminar registro (DELETE)
  eliminar(id: number): void {
    this.billeteraService.eliminarBilletera(id).subscribe({
      next: () => {
        this.billeteras = this.billeteras.filter(b => b.id_billetera !== id);
        this.notificationService.showSuccess('Billetera eliminada');
        this.cerrarModal();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al eliminar billetera:', error);
        this.notificationService.showError('Error al eliminar billetera');
      }
    });
  }

  ngOnInit() {
    this.billeteraService.obtenerBilleteras().subscribe({
      next: (data) => {
        this.billeteras = data || [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al conectar con el microservicio:', error);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}
