import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuario-service';
import { NotificationService } from '../../services/notification.service';
import { BilleteraService } from '../../services/billetera-service';

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
  mostrarModalConfirmacion: boolean = false;

  usuarioSeleccionado: any = null;
  usuarioAEliminar: any = null;
  
  nuevoUsuario: any = {
    username: '',
    email: '',
    password_hash: '',
    rol: 'JUGADOR',
    estado: 'ACTIVO'
  };

  constructor(
    private usuariosService: UsuariosService,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    private billeteraService: BilleteraService
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
    } finally {
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
      this.notificationService.showError('Por favor complete los campos obligatorios.');
      return;
    }

    this.cargando = true;
    this.mostrarModalCrear = false;

    const ok = await this.usuariosService.crearUsuario(this.nuevoUsuario);
    if (ok) {
      this.notificationService.showSuccess('Usuario creado con éxito');
      try {
        const usuariosActualizados = await this.usuariosService.obtenerUsuarios();
        const usuarioCreado = usuariosActualizados.find(u => u.email === this.nuevoUsuario.email);
        
        if (usuarioCreado) {
          const nuevaBilletera = {
            id_usuario: usuarioCreado.id_usuario,
            saldo: 5000,
            saldo_bloqueado: 0,
            moneda: 'CLP',
            estado: 'activa'
          };
          await this.billeteraService.crearBilletera(nuevaBilletera).toPromise();
          this.notificationService.showSuccess(`Billetera en CLP creada para el usuario`);
        }
      } catch (err) {
        console.error('No se pudo crear la billetera asociada', err);
      }
    } else {
      this.notificationService.showError('Error al crear usuario');
    }
    await this.cargarUsuarios();
  }

  async editar() {
    if (!this.usuarioSeleccionado.username || !this.usuarioSeleccionado.email) {
      this.notificationService.showError('Por favor complete los campos obligatorios.');
      return;
    }

    this.cargando = true;
    this.mostrarModal = false;

    const ok = await this.usuariosService.actualizarUsuario(this.usuarioSeleccionado);
    if (ok) {
      this.notificationService.showSuccess('Cambios guardados con éxito');
    } else {
      this.notificationService.showError('Error al actualizar usuario');
    }
    await this.cargarUsuarios();
  }

  prepararEliminar(usuario: any) {
    this.usuarioAEliminar = usuario;
    this.mostrarModalConfirmacion = true;
    this.mostrarModal = false; // Cerramos el modal de edición si estaba abierto
  }

  cerrarModalConfirmacion() {
    this.mostrarModalConfirmacion = false;
    this.usuarioAEliminar = null;
  }

  async confirmarEliminar() {
    if (!this.usuarioAEliminar || !this.usuarioAEliminar.id_usuario) {
      this.notificationService.showError('No se pudo identificar el ID del usuario.');
      return;
    }

    this.cargando = true;
    this.mostrarModalConfirmacion = false;
    const id = this.usuarioAEliminar.id_usuario;

    const ok = await this.usuariosService.eliminarUsuario(id);
    if (ok) {
      this.notificationService.showSuccess('Usuario eliminado');
      try {
        const billeteras = await this.billeteraService.obtenerBilleteras().toPromise();
        const billeteraDelUsuario = billeteras?.find(b => b.id_usuario === id);
        if (billeteraDelUsuario) {
          await this.billeteraService.eliminarBilletera(billeteraDelUsuario.id_billetera).toPromise();
          this.notificationService.showSuccess(`Billetera #${billeteraDelUsuario.id_billetera} eliminada automáticamente`);
        }
      } catch (err) {
        console.error('No se pudo eliminar la billetera asociada', err);
      }
    } else {
      this.notificationService.showError('Error al eliminar usuario');
    }
    await this.cargarUsuarios();
  }
}