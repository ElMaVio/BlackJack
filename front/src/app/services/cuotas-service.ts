import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CuotasService {
  private url = environment.urlCuotas;

  constructor(private http: HttpClient) {}

  getCuotas() {
    return this.http.get<any[]>(this.url);
  }

  crearCuota(cuota: any) {
    return this.http.post<any>(this.url, cuota);
  }

  actualizarCuota(cuota: any) {
    return this.http.put<any>(this.url, cuota);
  }

  eliminarCuota(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
}
