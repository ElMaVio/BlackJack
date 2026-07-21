import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BilleteraService } from '../../services/billetera-service';
import { NotificationService } from '../../services/notification.service';
import { UsuariosService } from '../../services/usuario-service';

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
  private usuariosService = inject(UsuariosService);
  private cdr = inject(ChangeDetectorRef);
  private notificationService = inject(NotificationService);

  billeteras: Billetera[] = [];
  usuariosList: any[] = [];
  cargando: boolean = true;
  filtroActivo: string = 'todas';
  busqueda: string = '';

  billeteraSeleccionada: Billetera | null = null;
  mostrarModal: boolean = false;
  mostrarModalCrear: boolean = false;

  nuevaBilletera: any = {
    id_usuario: null,
    saldo: null,
    saldo_bloqueado: 0,
    moneda: 'CLP',
    estado: 'activo'
  };

  get billeterasFiltradas(): Billetera[] {
    let filtradas = this.billeteras;
    
    if (this.filtroActivo !== 'todas') {
      filtradas = filtradas.filter(b => b.estado === this.filtroActivo);
    }
    
    if (this.busqueda.trim()) {
      const termino = this.busqueda.toLowerCase();
      filtradas = filtradas.filter(b => {
        const idBilletera = String(b.id_billetera);
        const idUsuario = String(b.id_usuario);
        const username = this.obtenerNombreUsuario(b.id_usuario).toLowerCase();
        
        return idBilletera.includes(termino) || idUsuario.includes(termino) || username.includes(termino);
      });
    }
    
    return filtradas;
  }
  
  obtenerNombreUsuario(id: number): string {
    const usuario = this.usuariosList.find(u => u.id_usuario === id);
    return usuario ? usuario.username : `Usuario ${id}`;
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
    this.nuevaBilletera = { id_usuario: null, saldo: null, saldo_bloqueado: 0, moneda: 'CLP', estado: 'activo' };
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
    // Usamos Promise.all para cargar billeteras y usuarios al mismo tiempo
    Promise.all([
      this.billeteraService.obtenerBilleteras().toPromise(),
      this.usuariosService.obtenerUsuarios()
    ]).then(([billeteras, usuarios]) => {
      this.billeteras = billeteras || [];
      this.usuariosList = usuarios || [];
      this.cargando = false;
      this.cdr.detectChanges();
    }).catch(error => {
      console.error('Error al cargar datos:', error);
      this.cargando = false;
      this.cdr.detectChanges();
    });
  }
}
