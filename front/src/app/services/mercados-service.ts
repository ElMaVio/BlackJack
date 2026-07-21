import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MercadosService {
  private url = environment.urlMercados;

  constructor(private http: HttpClient) {}

  getMercados() {
    return this.http.get<any[]>(this.url);
  }

  crearMercado(mercado: any) {
    return this.http.post<any>(this.url, mercado);
  }

  actualizarMercado(mercado: any) {
    return this.http.put<any>(this.url, mercado);
  }

  eliminarMercado(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
}
