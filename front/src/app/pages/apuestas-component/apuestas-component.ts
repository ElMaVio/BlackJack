import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApuestasService } from '../../services/apuestas-service';

export interface Apuesta {
  id_apuesta: number;
  id_usuario: number;
  id_billetera: number;
  monto_total: number;
  ganancia_potencial: number;
  tipo_apuesta: string;
  estado: string;
  fecha_creacion: string;
  fecha_resolucion: string | null;
}

@Component({
  selector: 'app-apuestas-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apuestas-component.html',
  styleUrl: './apuestas-component.scss',
})
export class ApuestasComponent implements OnInit {
  private apuestasService = inject(ApuestasService);
  private cdr = inject(ChangeDetectorRef);

  apuestas: Apuesta[] = [];
  cargando: boolean = true;
  filtroActivo: string = 'todas';

  apuestaSeleccionada: Apuesta | null = null;
  mostrarModal: boolean = false;
  mostrarModalCrear: boolean = false;

  nuevaApuesta = {
    id_usuario: 1001, // Valor por defecto inicial
    id_billetera: 1,
    monto_total: 0,
    ganancia_potencial: 0,
    tipo_apuesta: 'simple',
    estado: 'pendiente'
  };

  get apuestasFiltradas(): Apuesta[] {
    if (this.filtroActivo === 'todas') return this.apuestas;
    return this.apuestas.filter(a => a.estado === this.filtroActivo);
  }

  get totalApostado(): number {
    return this.apuestas.reduce((acc, a) => acc + a.monto_total, 0);
  }

  get totalPremiosGanados(): number {
    return this.apuestas
      .filter(a => a.estado === 'ganada')
      .reduce((acc, a) => acc + a.ganancia_potencial, 0);
  }

  get apuestasPendientes(): number {
    return this.apuestas.filter(a => a.estado === 'pendiente').length;
  }

  setFiltro(filtro: string): void {
    this.filtroActivo = filtro;
    this.cdr.detectChanges();
  }

  abrirModalCrear(): void {
    this.nuevaApuesta = { id_usuario: 1001, id_billetera: 1, monto_total: 0, ganancia_potencial: 0, tipo_apuesta: 'simple', estado: 'pendiente' };
    this.mostrarModalCrear = true;
    this.cdr.detectChanges();
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
  }

  abrirDetalle(apuesta: Apuesta): void {
    this.apuestaSeleccionada = { ...apuesta };
    this.mostrarModal = true;
    this.cdr.detectChanges();
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.apuestaSeleccionada = null;
    this.cdr.detectChanges();
  }

  formatearFecha(fecha: string | null): string {
    if (!fecha) return '---';
    return new Date(fecha).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // ============================================================
  // OPERACIONES CRUD (ACCIONES DEL BACKEND)
  // ============================================================

  // 1. Guardar
  crear(): void {
    this.apuestasService.crearApuesta(this.nuevaApuesta).subscribe({
      next: (creada) => {
        this.apuestas.push(creada);
        this.cerrarModalCrear();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al crear la apuesta:', error);
        alert('Error: ' + (error.error?.message || 'Verifica los fondos de la billetera.'));
      }
    });
  }

  // 2. Modificar/Resolver estado de la apuesta
  editar(): void {
    if (!this.apuestaSeleccionada) return;

    this.apuestasService.editarApuesta(this.apuestaSeleccionada).subscribe({
      next: (actualizada) => {
        const idx = this.apuestas.findIndex(a => a.id_apuesta === actualizada.id_apuesta);
        if (idx !== -1) {
          this.apuestas[idx] = actualizada; // Actualiza el ticket en pantalla con el nuevo estado y fecha_resolucion
        }
        this.cerrarModal();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al actualizar la apuesta:', error);
      }
    });
  }

  // 3. Eliminar
  eliminar(id: number): void {
    this.apuestasService.eliminarApuesta(id).subscribe({
      next: () => {
        this.apuestas = this.apuestas.filter(a => a.id_apuesta !== id);
        this.cerrarModal();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al eliminar la apuesta:', error);
      }
    });
  }

  ngOnInit() {
    this.apuestasService.obtenerApuestas().subscribe({
      next: (data) => {
        this.apuestas = data || [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al conectar con apuestas-service:', error);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}
