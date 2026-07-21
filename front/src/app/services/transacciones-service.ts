import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {
  private url = environment.urlTransacciones;

  constructor(private http: HttpClient) {}

  getTransacciones() {
    return this.http.get(this.url);
  }

  hacerTransaccion(datos: any) {
    return this.http.post(this.url, datos);
  }
}
