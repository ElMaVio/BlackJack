import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventosService } from '../../services/eventos-services';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eventos-component.html',
  styleUrls: ['./eventos-component.scss']
})
export class EventosComponent implements OnInit {

  
  eventos: any[] = [];
  eventosFiltrados: any[] = [];

  
  cargando: boolean = true;
  busqueda: string = '';
  mostrarModal: boolean = false;
  mostrarModalCrear: boolean = false;
  eventoSeleccionado: any = null;

  nuevoEvento = {
    nombre: '',
    deporte: '',
    liga: '',
    equipoLocal: '',
    equipoVisitante: '',
    fechaInicio: '',
    estado: 'PROGRAMADO'
  };

  constructor(
    private _eventosService: EventosService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.cargarEventos();
  }

  async cargarEventos() {
    this.cargando = true;
    try {
      console.log('Solicitando partidos al microservicio...');
      const data = await this._eventosService.obtenerEventos();
      console.log('Partidos recibidos:', data);

      this.eventos = data || [];
      this.eventosFiltrados = data || [];
    } catch (error) {
      console.error('Error al mapear eventos:', error);
      this.eventos = [];
      this.eventosFiltrados = [];
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  // Buscador por nombre del evento o deporte
  filtrar() {
    if (!this.busqueda) {
      this.eventosFiltrados = this.eventos;
    } else {
      const termino = this.busqueda.toLowerCase();
      this.eventosFiltrados = this.eventos.filter(e =>
        e.nombre?.toLowerCase().includes(termino) ||
        e.deporte?.toLowerCase().includes(termino)
      );
    }
    this.cdr.detectChanges();
  }

  // ─── Modal Crear ────────────────────────────────────────────────────────────
  abrirModalCrear() {
    this.mostrarModalCrear = true;
    this.cdr.detectChanges();
  }

  cerrarModalCrear() {
    this.mostrarModalCrear = false;
    this.nuevoEvento = {
      nombre: '',
      deporte: '',
      liga: '',
      equipoLocal: '',
      equipoVisitante: '',
      fechaInicio: '',
      estado: 'PROGRAMADO'
    };
    this.cdr.detectChanges();
  }

  async crear() {
    if (!this.nuevoEvento.nombre || !this.nuevoEvento.deporte) {
      alert('Por favor, ingresa el nombre y el deporte del evento.');
      return;
    }
    const res = await this._eventosService.crearEvento(this.nuevoEvento);
    alert(res);
    this.cerrarModalCrear();
    await this.cargarEventos();
  }

  // ─── Modal Editar / Eliminar ─────────────────────────────────────────────────
  abrirDetalle(evento: any) {
    this.eventoSeleccionado = { ...evento };
    this.mostrarModal = true;
    this.cdr.detectChanges();
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.eventoSeleccionado = null;
    this.cdr.detectChanges();
  }

  async editar() {
    const res = await this._eventosService.actualizarEvento(this.eventoSeleccionado);
    alert(res);
    this.cerrarModal();
    await this.cargarEventos();
  }

  async eliminar(id: number) {
    if (confirm('¿Estás completamente seguro de cancelar y eliminar este evento deportivo?')) {
      const res = await this._eventosService.eliminarEvento(id);
      alert(res);
      this.cerrarModal();
      await this.cargarEventos();
    }
  }
}