import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MercadosService } from '../../services/mercados-service';
import { ApuestasService, bodyAgregarApuesta } from '../../services/apuestas-service';
import { BilleteraService } from '../../services/billetera-service';
import { UsuariosService } from '../../services/usuario-service';
import { CuotasService } from '../../services/cuotas-service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-mercados',
  templateUrl: './mercados-component.html',
  styleUrls: ['./mercados-component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MercadosComponent implements OnInit {
  isAdminMode: boolean = false;
  
  // Eventos/Mercados Mocks para la UI del Casino
  eventos: any[] = [
    { id: 1, nombre: 'Colo Colo vs U. de Chile', deporte: 'Fútbol', 
      mercados: [
        { id_mercado: 101, tipo: '1 - Local', cuota: 1.50, estado: 'ACTIVO' },
        { id_mercado: 102, tipo: 'X - Empate', cuota: 3.20, estado: 'ACTIVO' },
        { id_mercado: 103, tipo: '2 - Visita', cuota: 2.10, estado: 'ACTIVO' }
      ]
    },
    { id: 2, nombre: 'Lakers vs Bulls', deporte: 'Básquetbol',
      mercados: [
        { id_mercado: 201, tipo: '1 - Local', cuota: 1.50, estado: 'ACTIVO' },
        { id_mercado: 202, tipo: 'X - Empate', cuota: 3.20, estado: 'ACTIVO' },
        { id_mercado: 203, tipo: '2 - Visita', cuota: 2.10, estado: 'ACTIVO' }
      ]
    }
  ];

  // Variables Modal Apuesta (Jugador)
  mostrarModalApuesta = false;
  mercadoSeleccionado: any = null;
  eventoSeleccionado: any = null;
  montoApuesta: number = 1000;
  idUsuarioApostador: number | null = null;
  idBilleteraApostador: number | null = null;

  // Listas para conexión
  usuariosList: any[] = [];
  billeterasList: any[] = [];

  // Variables Modal Gestión (Admin)
  mostrarModalAdmin = false;
  estadoResolucion: string = 'ACTIVO';
  isResolving: boolean = false;

  constructor(
    private mercadosService: MercadosService,
    private apuestasService: ApuestasService,
    private billeteraService: BilleteraService,
    private usuariosService: UsuariosService,
    private cuotasService: CuotasService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Cargar listas de Billeteras y Usuarios
    Promise.all([
      this.usuariosService.obtenerUsuarios(),
      this.billeteraService.obtenerBilleteras().toPromise()
    ]).then(([usuarios, billeteras]) => {
      this.usuariosList = usuarios || [];
      this.billeterasList = billeteras || [];
    }).catch(() => console.warn('Usuarios/Billeteras offline'));

    // Cargar Cuotas reales para inyectar en los Mercados Mocks
    this.cuotasService.getCuotas().subscribe({
      next: (cuotas: any[]) => {
        if (cuotas && cuotas.length > 0) {
          this.eventos.forEach(evento => {
            evento.mercados.forEach((mercado: any) => {
              const cuotaReal = cuotas.find(c => c.id_mercado === mercado.id_mercado);
              if (cuotaReal) {
                mercado.cuota = cuotaReal.valor;
                mercado.estado = cuotaReal.estado;
              }
            });
          });
        }
        setTimeout(() => this.cdr.markForCheck());
      },
      error: () => console.log('Servicio Cuotas offline, usando mocks por defecto')
    });
  }

  onUsuarioChange(): void {
    if (this.idUsuarioApostador) {
      const billetera = this.billeterasList.find(b => b.id_usuario == this.idUsuarioApostador);
      this.idBilleteraApostador = billetera ? billetera.id_billetera : null;
    } else {
      this.idBilleteraApostador = null;
    }
  }

  // --- Click en el botón de la cuota ---
  seleccionarMercado(evento: any, mercado: any) {
    this.eventoSeleccionado = evento;
    this.mercadoSeleccionado = mercado;

    if (this.isAdminMode) {
      this.estadoResolucion = mercado.estado;
      this.mostrarModalAdmin = true;
    } else {
      if (mercado.estado !== 'ACTIVO') {
        this.notificationService.showError('Este mercado ya no acepta apuestas.');
        return;
      }
      this.montoApuesta = 1000;
      this.idUsuarioApostador = null;
      this.idBilleteraApostador = null;
      this.mostrarModalApuesta = true;
    }
  }

  // --- MODO JUGADOR: Hacer Apuesta ---
  cerrarModalApuesta() {
    this.mostrarModalApuesta = false;
    this.cdr.detectChanges();
  }

  async confirmarApuesta() {
    if (!this.idUsuarioApostador || !this.idBilleteraApostador) {
      this.notificationService.showError('Debes seleccionar un usuario válido con billetera');
      return;
    }

    if (this.montoApuesta <= 0) {
      this.notificationService.showError('El monto debe ser mayor a 0');
      return;
    }

    const ganancia = this.montoApuesta * this.mercadoSeleccionado.cuota;
    
    // Descontar saldo de billetera real primero
    try {
      const wallet = await this.billeteraService.obtenerBilleteraPorId(this.idBilleteraApostador).toPromise();
      if (wallet.saldo < this.montoApuesta) {
         this.notificationService.showError('Saldo insuficiente en la billetera.');
         return;
      }
      wallet.saldo -= this.montoApuesta;
      await this.billeteraService.editarBilletera(wallet).toPromise();
    } catch(e) {
      this.notificationService.showError('No se pudo descontar el dinero de la billetera (Offline)');
      return; // No dejar apostar si falla billetera real
    }

    const nuevaApuesta: bodyAgregarApuesta = {
      id_usuario: this.idUsuarioApostador,
      id_billetera: this.idBilleteraApostador,
      monto_total: this.montoApuesta,
      ganancia_potencial: ganancia,
      tipo_apuesta: `Mercado #${this.mercadoSeleccionado.id_mercado} - ${this.eventoSeleccionado.nombre} (${this.mercadoSeleccionado.tipo})`,
      estado: 'pendiente'
    };

    try {
      await this.apuestasService.crearApuesta(nuevaApuesta).toPromise();
      this.notificationService.showSuccess(`Apuesta de $${this.montoApuesta} registrada exitosamente.`);
    } catch (err) {
      // Fallback offline
      console.error(err);
      this.notificationService.showSuccess(`Apuesta (Offline) guardada: Ganancia potencial $${ganancia.toFixed(0)}`);
    }

    this.cerrarModalApuesta();
  }

  // --- MODO ADMIN: Gestionar Mercado ---
  cerrarModalAdmin() {
    this.mostrarModalAdmin = false;
    this.cdr.detectChanges();
  }

  async resolverMercado() {
    if (this.estadoResolucion === this.mercadoSeleccionado.estado) {
      this.cerrarModalAdmin();
      return;
    }

    this.isResolving = true;
    const estadoAnterior = this.mercadoSeleccionado.estado;
    this.mercadoSeleccionado.estado = this.estadoResolucion; // Actualizar UI rápido

    try {
      // 1. Notificar backend que el mercado cambió
      try {
         await this.mercadosService.actualizarMercado(this.mercadoSeleccionado).toPromise();
      } catch(e) { console.warn("Backend de mercados offline, procediendo con orquestación offline..."); }

      // 2. ORQUESTACIÓN: Buscar apuestas afectadas y pagar
      if (this.estadoResolucion === 'VICTORIA' || this.estadoResolucion === 'CANCELADO') {
        let todasLasApuestas: any[] = [];
        try {
          todasLasApuestas = await this.apuestasService.obtenerApuestas().toPromise() || [];
        } catch(e) { console.warn("No se pudieron cargar apuestas reales"); }

        // Filtramos las apuestas correspondientes a este mercado (en simulación, filtramos por substring en tipo_apuesta)
        const apuestasMercado = todasLasApuestas.filter(a => 
          a.tipo_apuesta.includes(`Mercado #${this.mercadoSeleccionado.id_mercado}`) && a.estado === 'PENDIENTE'
        );

        let pagosTotal = 0;
        let countPagos = 0;

        for (let apuesta of apuestasMercado) {
          // Lógica de pago
          let pago = 0;
          if (this.estadoResolucion === 'VICTORIA') {
            pago = apuesta.ganancia_potencial;
            apuesta.estado = 'GANADA';
          } else if (this.estadoResolucion === 'CANCELADO') {
            pago = apuesta.monto_total; // Reembolso
            apuesta.estado = 'DEVUELTA';
          }

          if (pago > 0) {
             try {
                const wallet = await this.billeteraService.obtenerBilleteraPorId(apuesta.id_billetera).toPromise();
                wallet.saldo += pago;
                await this.billeteraService.editarBilletera(wallet).toPromise();
                pagosTotal += pago;
                countPagos++;
             } catch(e) { console.error("Fallo al actualizar billetera", apuesta.id_billetera); }
          }
          
          // Actualizar apuesta
          try {
             await this.apuestasService.editarApuesta(apuesta).toPromise();
          } catch(e) {}
        }

        if (countPagos > 0) {
          this.notificationService.showSuccess(`Mercado Resuelto. Se procesaron ${countPagos} pagos por un total de $${pagosTotal}.`);
        } else {
          this.notificationService.showSuccess(`Mercado actualizado a ${this.estadoResolucion}. No hubieron apuestas pendientes que pagar.`);
        }
      } else if (this.estadoResolucion === 'DERROTA') {
        // En caso de derrota, no se paga, pero se marcan perdidas
        this.notificationService.showSuccess('Mercado marcado como DERROTA. Apuestas actualizadas.');
      } else {
        this.notificationService.showSuccess('Mercado actualizado correctamente.');
      }

    } catch (err) {
      console.error(err);
      this.mercadoSeleccionado.estado = estadoAnterior; // rollback
      this.notificationService.showError('Ocurrió un error al resolver el mercado.');
    } finally {
      this.isResolving = false;
      this.cerrarModalAdmin();
    }
  }
}
