import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventosService } from '../../services/eventos-services';
import { NotificationService } from '../../services/notification.service';

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

  nuevoEvento: any = {
    nombre: '',
    deporte: '',
    tipo: 'DEPORTE',
    liga: '',
    equipoLocal: '',
    equipoVisitante: '',
    fechaInicio: '',
    estado: 'PROGRAMADO'
  };

  fechaCrear: string = '';
  horaCrear: string = '';
  fechaEditar: string = '';
  horaEditar: string = '';

  categoriasDeporte = ['Fútbol', 'Básquetbol', 'Tenis', 'Voleibol', 'Béisbol', 'eSports'];
  categoriasCasino = ['Poker', 'Ruleta', 'BlackJack', 'Tragamonedas', 'Baccarat', 'Bingo'];

  get categoriasSugeridasCrear() {
    return this.nuevoEvento.tipo === 'CASINO' ? this.categoriasCasino : this.categoriasDeporte;
  }

  get categoriasSugeridasEditar() {
    return this.eventoSeleccionado?.tipo === 'CASINO' ? this.categoriasCasino : this.categoriasDeporte;
  }

  constructor(
    private eventosService: EventosService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.cargarEventos();
  }

  async cargarEventos() {
    try {
      console.log('Solicitando partidos al microservicio...');
      const data = await this.eventosService.obtenerEventos();
      console.log('Partidos recibidos:', data);

      this.eventos = data || [];
      this.eventosFiltrados = this.eventos;
    } catch (error) {
      console.error('Error al mapear eventos:', error);
      this.cargarMocksSiBackendFalla();
      this.eventosFiltrados = this.eventos;
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  private cargarMocksSiBackendFalla() {
    this.eventos = [
      {
        idEvento: 1,
        nombre: 'Colo Colo vs U. de Chile',
        deporte: 'Fútbol',
        tipo: 'DEPORTE',
        liga: 'Primera División',
        equipoLocal: 'Colo Colo',
        equipoVisitante: 'U. de Chile',
        fechaInicio: '2026-07-22T18:00',
        estado: 'PROGRAMADO'
      },
      {
        idEvento: 2,
        nombre: 'Torneo Texas Holdem Elite',
        deporte: 'Poker',
        tipo: 'CASINO',
        liga: 'Serie Mundial',
        equipoLocal: 'Mesa 1',
        equipoVisitante: '',
        fechaInicio: '2026-07-23T20:00',
        estado: 'PROGRAMADO'
      }
    ];
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
    this.eventoSeleccionado = null;
    this.nuevoEvento = {
      nombre: '', deporte: '', tipo: 'DEPORTE', liga: '',
      equipoLocal: '', equipoVisitante: '', fechaInicio: '', estado: 'PROGRAMADO'
    };
    this.fechaCrear = '';
    this.horaCrear = '';
    this.mostrarModalCrear = true;
  }

  cerrarModalCrear() {
    this.mostrarModalCrear = false;
    this.nuevoEvento = {
      nombre: '',
      deporte: '',
      tipo: 'DEPORTE',
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
      this.notificationService.showError('Por favor, ingresa el nombre y el deporte del evento.');
      return;
    }
    
    if (!this.fechaCrear || !this.horaCrear) {
      this.notificationService.showError('Debes seleccionar una fecha y hora de inicio.');
      return;
    }
    
    // Unir fecha y hora
    this.nuevoEvento.fechaInicio = `${this.fechaCrear}T${this.horaCrear}`;
    
    const fechaElegida = new Date(this.nuevoEvento.fechaInicio);
    if (fechaElegida.getTime() < new Date().getTime()) {
      this.notificationService.showError('La fecha del evento no puede ser en el pasado.');
      return;
    }
    
    const eventoCrear = { ...this.nuevoEvento };
    this.cerrarModalCrear();
    const res = await this.eventosService.crearEvento(eventoCrear);
    this.notificationService.showSuccess(res);
    await this.cargarEventos();
  }

  // ─── Modal Editar / Eliminar ─────────────────────────────────────────────────
  abrirDetalle(evento: any) {
    this.eventoSeleccionado = { ...evento };
    
    if (this.eventoSeleccionado.fechaInicio) {
       const partes = this.eventoSeleccionado.fechaInicio.split('T');
       if (partes.length === 2) {
         this.fechaEditar = partes[0];
         this.horaEditar = partes[1].substring(0, 5); // Tomar solo HH:mm
       }
    } else {
       this.fechaEditar = '';
       this.horaEditar = '';
    }
    
    this.mostrarModal = true;
    this.cdr.detectChanges();
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.eventoSeleccionado = null;
    this.cdr.detectChanges();
  }

  async editar() {
    if (this.fechaEditar && this.horaEditar) {
      this.eventoSeleccionado.fechaInicio = `${this.fechaEditar}T${this.horaEditar}`;
    }
    const eventoActualizar = { ...this.eventoSeleccionado };
    this.cerrarModal();
    
    const res = await this.eventosService.actualizarEvento(eventoActualizar);
    this.notificationService.showSuccess(res);
    await this.cargarEventos();
  }

  async eliminar() {
    if (this.eventoSeleccionado && this.eventoSeleccionado.idEvento) {
      const idEliminar = this.eventoSeleccionado.idEvento;
      this.cerrarModal();
      try {
        const res = await this.eventosService.eliminarEvento(idEliminar);
        this.notificationService.showSuccess('Evento eliminado con éxito.');
        await this.cargarEventos();
      } catch (err) {
        console.error(err);
        this.eventos = this.eventos.filter(e => e.idEvento !== idEliminar);
        this.notificationService.showSuccess('Evento (offline) eliminado con éxito.');
      }
    }
  }
}