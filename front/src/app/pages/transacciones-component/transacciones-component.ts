import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransaccionesService } from '../../services/transacciones-service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones-component.html',
  styleUrls: ['./transacciones-component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TransaccionesComponent implements OnInit {
  transacciones: any[] = [];
  monto: number = 2500; // Por defecto el mínimo
  tipo: string = 'DEPOSITO';
  
  // Usuario simulado 'Prueba' para simular la vista del usuario
  usuarioActual = { id: 3, username: 'Prueba', idBilleteraAsignada: 105, saldo: 5000 }; 

  constructor(
    private transaccionesService: TransaccionesService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.transaccionesService.getTransacciones().subscribe({
      next: (data: any) => {
        this.transacciones = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Servicio offline, usar historial en memoria');
        this.cdr.detectChanges();
      }
    });
  }

  procesarTransaccion() {
    if (this.monto < 2500) {
      this.notificationService.showError('Error: La transacción mínima es de 2500 pesos.');
      return;
    }

    // Simulando que el usuario solo usa su billetera asignada automáticamente
    const nuevaTransaccion = {
      id_billetera: this.usuarioActual.idBilleteraAsignada,
      monto: this.monto,
      tipo_transaccion: this.tipo,
      fecha: new Date().toISOString()
    };

    this.transaccionesService.hacerTransaccion(nuevaTransaccion).subscribe({
      next: () => {
        this.notificationService.showSuccess('¡Transacción exitosa! Tu saldo será actualizado.');
        this.cargarHistorial();
      },
      error: () => {
        // Fallback por si los microservicios están apagados
        this.notificationService.showSuccess(`Transacción simulada (Offline) de $${this.monto} a tu billetera única.`);
        this.transacciones.push(nuevaTransaccion);
      }
    });
  }
}
