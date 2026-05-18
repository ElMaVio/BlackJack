import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuario-service';

@Component({
  selector: 'app-ver-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios-component.html',
  styleUrls: ['./usuarios-component.scss']
})
export class VerUsuariosComponent implements OnInit {

  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  rolesUnicos: string[] = [];
  cargando: boolean = true;
  
  busqueda: string = '';
  filtroEstado: string = 'todos';
  filtroRol: string = 'todos';

  mostrarModal: boolean = false;
  mostrarModalCrear: boolean = false;

  usuarioSeleccionado: any = null;
  nuevoUsuario: any = {
    username: '',
    email: '',
    password_hash: '',
    rol: 'JUGADOR',
    estado: 'ACTIVO'
  };

  constructor(
    private usuariosService: UsuariosService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.cargarUsuarios();
  }

  get totalActivos(): number {
    return this.usuarios.filter(u => u.estado?.toLowerCase() === 'activo').length;
  }

  get totalAdmins(): number {
    return this.usuarios.filter(u => u.rol?.toLowerCase() === 'admin').length;
  }

  async cargarUsuarios() {
    this.cargando = true;
    try {
      const datos = await this.usuariosService.obtenerUsuarios();
      this.usuarios = datos || [];
      this.extraerRoles();
      this.aplicarFiltros();
    } catch (error) {
      console.error(error);
    } {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  extraerRoles() {
    const roles = this.usuarios.map(u => u.rol).filter(r => r);
    this.rolesUnicos = [...new Set(roles)];
  }

  aplicarFiltros() {
    this.usuariosFiltrados = this.usuarios.filter(u => {
      const cumpleBusqueda = !this.busqueda ? true :
        u.username?.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        u.email?.toLowerCase().includes(this.busqueda.toLowerCase());

      const cumpleEstado = this.filtroEstado === 'todos' ? true :
        u.estado?.toLowerCase() === this.filtroEstado.toLowerCase();

      const cumpleRol = this.filtroRol === 'todos' ? true :
        u.rol === this.filtroRol;

      return cumpleBusqueda && cumpleEstado && cumpleRol;
    });
  }

  abrirModalCrear() {
    this.nuevoUsuario = { username: '', email: '', password_hash: '', rol: 'JUGADOR', estado: 'ACTIVO' };
    this.mostrarModalCrear = true;
  }

  cerrarModalCrear() {
    this.mostrarModalCrear = false;
  }

  abrirDetalle(usuario: any) {
    this.usuarioSeleccionado = { ...usuario };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.usuarioSeleccionado = null;
  }

  async crear() {
    if (!this.nuevoUsuario.username || !this.nuevoUsuario.email) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    this.cargando = true;
    this.mostrarModalCrear = false;

    const ok = await this.usuariosService.crearUsuario(this.nuevoUsuario);
    if (ok) {
      alert('Usuario creado con éxito');
    } else {
      alert('Error al crear usuario');
    }
    await this.cargarUsuarios();
  }

  async editar() {
    if (!this.usuarioSeleccionado.username || !this.usuarioSeleccionado.email) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    this.cargando = true;
    this.mostrarModal = false;

    const ok = await this.usuariosService.actualizarUsuario(this.usuarioSeleccionado);
    if (ok) {
      alert('Cambios guardados con éxito');
    } else {
      alert('Error al actualizar usuario');
    }
    await this.cargarUsuarios();
  }

  async eliminar(id: number) {
    if (!id) {
      alert('No se pudo identificar el ID del usuario.');
      return;
    }

    if (confirm('¿Está seguro de eliminar este usuario?')) {
      this.cargando = true;
      this.mostrarModal = false;

      const ok = await this.usuariosService.eliminarUsuario(id);
      if (ok) {
        alert('Usuario eliminado');
      } else {
        alert('Error al eliminar usuario');
      }
      await this.cargarUsuarios();
    }
  }
}