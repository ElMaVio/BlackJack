import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ApuestasService {
  private http = inject(HttpClient);

  // 1. Obtener
  obtenerApuestas() {
    return this.http.get<any[]>(environment.urlApuestas);
  }

  // 2. Buscar
  obtenerApuestaPorId(idApuesta: number) {
    return this.http.get<any>(`${environment.urlApuestas}/${idApuesta}`);
  }

  // 3. Crear
  crearApuesta(apuestaNueva: bodyAgregarApuesta) {
    return this.http.post<any>(environment.urlApuestas, apuestaNueva);
  }

  // 4. Modificar
  editarApuesta(apuestaEditada: bodyEditarApuesta) {
    return this.http.put<any>(environment.urlApuestas, apuestaEditada);
  }

  // 5. Eliminar
  eliminarApuesta(idApuesta: number) {
    return this.http.delete(`${environment.urlApuestas}/${idApuesta}`, { responseType: 'text' });
  }
}

// Interfaces agregar editar
export interface bodyAgregarApuesta {
  id_usuario: number;
  id_billetera: number;
  monto_total: number;
  ganancia_potencial: number;
  tipo_apuesta: string;
  estado: string;
}

export interface bodyEditarApuesta {
  id_apuesta: number;
  id_usuario: number;
  id_billetera: number;
  monto_total: number;
  ganancia_potencial: number;
  tipo_apuesta: string;
  estado: string;
}
