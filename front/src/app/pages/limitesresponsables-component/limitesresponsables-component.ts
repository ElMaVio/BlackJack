import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LimitesService } from '../../services/limitesresponsables-service';

@Component({
  selector: 'app-limitesresponsables',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './limitesresponsables-component.html',
  styleUrls: ['./limitesresponsables-component.scss']
})
export class LimitesresponsablesComponent implements OnInit {

  limites: any[] = [];
  limitesFiltrados: any[] = [];
  cargando: boolean = true;

  busqueda: string = '';

  mostrarModal: boolean = false;
  mostrarModalCrear: boolean = false;
  mostrarModalEliminar: boolean = false;

  limiteSeleccionado: any = null;
  nuevoLimite: any = {
    usuariosIdUsuario: null,
    limiteDiario: null,
    limiteMensual: null
  };

  constructor(
    private limitesService: LimitesService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.cargarLimites();
  }

  // ── Carga ──────────────────────────────────────────
  async cargarLimites() {
    this.cargando = true;
    try {
      const datos = await this.limitesService.obtenerLimites();
      this.limites = datos || [];
      this.limitesFiltrados = [...this.limites];
    } catch (error) {
      console.error(error);
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  // ── Filtro ─────────────────────────────────────────
  filtrar() {
    const termino = this.busqueda.trim().toLowerCase();
    if (!termino) {
      this.limitesFiltrados = [...this.limites];
      return;
    }
    this.limitesFiltrados = this.limites.filter(l =>
      String(l.usuariosIdUsuario).includes(termino)
    );
  }

  // ── Crear ──────────────────────────────────────────
  abrirModalCrear() {
    this.nuevoLimite = { usuariosIdUsuario: null, limiteDiario: null, limiteMensual: null };
    this.mostrarModalCrear = true;
  }

  cerrarModalCrear() {
    this.mostrarModalCrear = false;
  }

  async crear() {
    if (!this.nuevoLimite.usuariosIdUsuario || !this.nuevoLimite.limiteDiario || !this.nuevoLimite.limiteMensual) {
      alert('Por favor complete todos los campos.');
      return;
    }
    this.mostrarModalCrear = false;
    this.cargando = true;
    const respuesta = await this.limitesService.crearLimite(this.nuevoLimite);
    alert(respuesta ?? 'Límite creado con éxito');
    await this.cargarLimites();
  }

  // ── Editar ─────────────────────────────────────────
  abrirDetalle(limite: any) {
    this.limiteSeleccionado = { ...limite };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.limiteSeleccionado = null;
  }

  async editar() {
    if (
      this.limiteSeleccionado.limiteDiario == null ||
      this.limiteSeleccionado.limiteMensual == null
    ) {
      alert('Por favor complete todos los campos.');
      return;
    }
    this.mostrarModal = false;
    this.cargando = true;
    const respuesta = await this.limitesService.actualizarLimite(this.limiteSeleccionado);
    alert(respuesta ?? 'Límite actualizado con éxito');
    await this.cargarLimites();
  }

  // ── Eliminar ───────────────────────────────────────
  confirmarEliminar() {
    this.mostrarModal = false;
    this.mostrarModalEliminar = true;
  }

  cancelarEliminar() {
    this.mostrarModalEliminar = false;
    this.mostrarModal = true;
  }

  async eliminar(id: number) {
    if (!id) {
      alert('No se pudo identificar el ID del límite.');
      return;
    }
    this.mostrarModalEliminar = false;
    this.cargando = true;
    const respuesta = await this.limitesService.eliminarLimite(id);
    this.limiteSeleccionado = null;
    alert(respuesta ?? 'Límite eliminado');
    await this.cargarLimites();
  }
}