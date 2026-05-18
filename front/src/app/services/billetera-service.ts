import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BilleteraService {
  private http = inject(HttpClient);

  // 1. Obtener todas las billeteras del sistema (Retorna un Observable)
  obtenerBilleteras() {
    return this.http.get<any[]>(environment.urlWallet);
  }

  // 2. Crear una nueva billetera
  crearBilletera(billeteraNueva: bodyAgregarBilletera) {
    return this.http.post<any>(environment.urlWallet, billeteraNueva);
  }

  // 3. Modificar saldos o estado de la billetera
  editarBilletera(billeteraEditada: bodyEditarBilletera) {
    return this.http.put<any>(environment.urlWallet, billeteraEditada);
  }

  // 4. Buscar la billetera específica por su ID
  obtenerBilleteraPorId(idBilletera: number) {
    return this.http.get<any>(`${environment.urlWallet}/${idBilletera}`);
  }

  // 5. Eliminar una billetera
  eliminarBilletera(idBilletera: number) {
    return this.http.delete<any>(`${environment.urlWallet}/${idBilletera}`);
  }
}

// Interfaces exportadas para que el componente las pueda usar si las necesita
export interface bodyAgregarBilletera {
  id_usuario: number;
  saldo: number;
  saldo_bloqueado: number;
  moneda: string;
  estado: string;
}

export interface bodyEditarBilletera {
  id_billetera: number;
  id_usuario: number;
  saldo: number;
  saldo_bloqueado: number;
  moneda: string;
  estado: string;
}
