import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApuestasService } from '../../services/apuestas-service';
import { NotificationService } from '../../services/notification.service';
import { UsuariosService } from '../../services/usuario-service';
import { BilleteraService } from '../../services/billetera-service';

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
  private usuariosService = inject(UsuariosService);
  private billeteraService = inject(BilleteraService);
  private cdr = inject(ChangeDetectorRef);
  private notificationService = inject(NotificationService);

  apuestas: Apuesta[] = [];
  usuariosList: any[] = [];
  billeterasList: any[] = [];
  cargando: boolean = true;
  filtroActivo: string = 'todas';

  apuestaSeleccionada: Apuesta | null = null;
  estadoOriginal: string = '';
  mostrarModal: boolean = false;
  mostrarModalCrear: boolean = false;

  nuevaApuesta: any = {
    id_usuario: null,
    id_billetera: null,
    monto_total: null,
    ganancia_potencial: null,
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
    this.nuevaApuesta = { id_usuario: null, id_billetera: null, monto_total: null, ganancia_potencial: null, tipo_apuesta: 'simple', estado: 'pendiente' };
    this.mostrarModalCrear = true;
    this.cdr.detectChanges();
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
  }

  abrirDetalle(apuesta: Apuesta): void {
    this.apuestaSeleccionada = { ...apuesta };
    this.estadoOriginal = apuesta.estado;
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

  onUsuarioChange(): void {
    // Buscar la billetera del usuario seleccionado y autocompletar
    if (this.nuevaApuesta.id_usuario) {
      const billetera = this.billeterasList.find(b => b.id_usuario == this.nuevaApuesta.id_usuario);
      if (billetera) {
        this.nuevaApuesta.id_billetera = billetera.id_billetera;
      }
    }
  }

  // ============================================================
  // OPERACIONES CRUD (ACCIONES DEL BACKEND)
  // ============================================================

  // 1. Guardar
  crear(): void {
    this.apuestasService.crearApuesta(this.nuevaApuesta).subscribe({
      next: (creada) => {
        this.apuestas.push(creada);
        this.notificationService.showSuccess('Apuesta creada con éxito');
        this.cerrarModalCrear();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al crear la apuesta:', error);
        this.notificationService.showError('Error: ' + (error.error?.message || 'Verifica los fondos de la billetera.'));
      }
    });
  }

  // 2. Modificar/Resolver estado de la apuesta
  editar(): void {
    if (!this.apuestaSeleccionada) return;

    this.apuestasService.editarApuesta(this.apuestaSeleccionada).subscribe({
      next: async (actualizada) => {
        const idx = this.apuestas.findIndex(a => a.id_apuesta === actualizada.id_apuesta);
        if (idx !== -1) {
          this.apuestas[idx] = actualizada; // Actualiza el ticket en pantalla
        }
        
        // Logica de descuento o pago de billetera según estado
        if (this.estadoOriginal !== actualizada.estado) {
          try {
            const billetera = await this.billeteraService.obtenerBilleteraPorId(actualizada.id_billetera).toPromise();
            if (billetera) {
              let requiereActualizacion = false;
              if (actualizada.estado === 'perdida' && this.estadoOriginal === 'pendiente') {
                billetera.saldo -= actualizada.monto_total; // se descuenta lo apostado
                requiereActualizacion = true;
              } else if (actualizada.estado === 'ganada' && this.estadoOriginal === 'pendiente') {
                billetera.saldo += actualizada.ganancia_potencial; // se suma la ganancia
                requiereActualizacion = true;
              }
              
              if (requiereActualizacion) {
                await this.billeteraService.editarBilletera(billetera).toPromise();
                this.notificationService.showSuccess(`Saldo de billetera #${billetera.id_billetera} actualizado`);
              }
            }
          } catch (error) {
            console.error('No se pudo actualizar el saldo de la billetera automáticamente', error);
          }
        }

        this.notificationService.showSuccess('Apuesta actualizada');
        this.cerrarModal();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al actualizar la apuesta:', error);
        this.notificationService.showError('Error al actualizar apuesta');
      }
    });
  }

  // 3. Eliminar
  eliminar(id: number): void {
    this.apuestasService.eliminarApuesta(id).subscribe({
      next: () => {
        this.apuestas = this.apuestas.filter(a => a.id_apuesta !== id);
        this.notificationService.showSuccess('Apuesta eliminada');
        this.cerrarModal();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al eliminar la apuesta:', error);
        this.notificationService.showError('Error al eliminar apuesta');
      }
    });
  }

  ngOnInit() {
    Promise.all([
      this.apuestasService.obtenerApuestas().toPromise(),
      this.usuariosService.obtenerUsuarios(),
      this.billeteraService.obtenerBilleteras().toPromise()
    ]).then(([apuestas, usuarios, billeteras]) => {
      this.apuestas = apuestas || [];
      this.usuariosList = usuarios || [];
      this.billeterasList = billeteras || [];
      this.cargando = false;
      this.cdr.detectChanges();
    }).catch(error => {
      console.error('Error al conectar con servicios:', error);
      this.cargando = false;
      this.cdr.detectChanges();
    });
  }
}
