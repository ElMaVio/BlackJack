import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JuegosService } from '../../services/juegos-service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-ver-juegos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ver-juegos-component.html',
  styleUrls: ['./ver-juegos-component.scss']
})
export class VerJuegosComponent implements OnInit {

  juegos: any[] = [];
  juegosFiltrados: any[] = [];
  tiposUnicos: string[] = [];
  cargando: boolean = true;

  busqueda: string = '';
  filtroEstado: string = 'todos';
  filtroTipo: string = 'todos';

  mostrarModal: boolean = false;
  mostrarModalCrear: boolean = false;
  mostrarModalEliminar: boolean = false; // ← NUEVO

  juegoSeleccionado: any = null;
  nuevoJuego: any = {
    nombre: '',
    tipo: '',
    proveedor: '',
    estado: 'ACTIVO'
  };

  constructor(
    private juegosService: JuegosService,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    await this.cargarJuegos();
  }

  get totalActivos(): number {
    return this.juegos.filter(j => j.estado?.toLowerCase() === 'activo').length;
  }

  get totalProveedores(): number {
    const proveedores = this.juegos.map(j => j.proveedor).filter(p => p);
    return new Set(proveedores).size;
  }

  async cargarJuegos() {
    this.cargando = true;
    try {
      const datos = await this.juegosService.obtenerJuegos();
      this.juegos = datos || [];
      this.extraerTipos();
      this.aplicarFiltros();
    } catch (error) {
      console.error(error);
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  extraerTipos() {
    const tipos = this.juegos.map(j => j.tipo).filter(t => t);
    this.tiposUnicos = [...new Set(tipos)];
  }

  aplicarFiltros() {
    this.juegosFiltrados = this.juegos.filter(j => {
      const cumpleBusqueda = !this.busqueda ? true :
        j.nombre?.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        j.proveedor?.toLowerCase().includes(this.busqueda.toLowerCase());

      const cumpleEstado = this.filtroEstado === 'todos' ? true :
        j.estado?.toLowerCase() === this.filtroEstado.toLowerCase();

      const cumpleTipo = this.filtroTipo === 'todos' ? true :
        j.tipo === this.filtroTipo;

      return cumpleBusqueda && cumpleEstado && cumpleTipo;
    });
  }

  // ── Crear ──────────────────────────────────────────
  abrirModalCrear() {
    this.nuevoJuego = { nombre: '', tipo: '', proveedor: '', estado: 'ACTIVO' };
    this.mostrarModalCrear = true;
  }

  cerrarModalCrear() {
    this.mostrarModalCrear = false;
  }

  async crear() {
    if (!this.nuevoJuego.nombre || !this.nuevoJuego.tipo || !this.nuevoJuego.proveedor) {
      this.notificationService.showError('Por favor complete todos los campos.');
      return;
    }
    this.mostrarModalCrear = false;
    this.cargando = true;
    const ok = await this.juegosService.crearJuego(this.nuevoJuego);
    if (ok) {
      this.notificationService.showSuccess('Juego creado con éxito');
    } else {
      this.notificationService.showError('Error al crear juego');
    }
    await this.cargarJuegos();
  }

  // ── Editar ─────────────────────────────────────────
  abrirDetalle(juego: any) {
    this.juegoSeleccionado = { ...juego };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.juegoSeleccionado = null;
  }

  async editar() {
    if (!this.juegoSeleccionado.nombre || !this.juegoSeleccionado.tipo || !this.juegoSeleccionado.proveedor) {
      this.notificationService.showError('Por favor complete todos los campos.');
      return;
    }
    this.mostrarModal = false;
    this.cargando = true;
    const ok = await this.juegosService.actualizarJuego(this.juegoSeleccionado);
    if (ok) {
      this.notificationService.showSuccess('Cambios guardados con éxito');
    } else {
      this.notificationService.showError('Error al actualizar juego');
    }
    await this.cargarJuegos();
  }

  // ── Eliminar ───────────────────────────────────────
  confirmarEliminar() {
    // Cierra el modal de edición y abre el de confirmación
    this.mostrarModal = false;
    this.mostrarModalEliminar = true;
  }

  cancelarEliminar() {
    // Vuelve al modal de edición
    this.mostrarModalEliminar = false;
    this.mostrarModal = true;
  }

  async eliminar(id: number) {
    if (!id) {
      this.notificationService.showError('No se pudo identificar el ID del juego.');
      return;
    }
    this.mostrarModalEliminar = false;
    this.cargando = true;
    const ok = await this.juegosService.eliminarJuego(id);
    if (ok) {
      this.juegoSeleccionado = null;
      this.notificationService.showSuccess('Juego eliminado');
    } else {
      this.notificationService.showError('Error al eliminar juego');
    }
    await this.cargarJuegos();
  }
}