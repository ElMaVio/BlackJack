import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JuegosService {

  private apiUrl = environment.urlJuegos; // Asegúrate de tener urlGames en tu environment

  constructor() { }

  async obtenerJuegos(): Promise<any[]> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async crearJuego(juego: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(juego)
      });
      return response.ok;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async actualizarJuego(juego: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/actualizar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(juego)
      });
      return response.ok;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async eliminarJuego(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE'
      });
      return response.ok;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}