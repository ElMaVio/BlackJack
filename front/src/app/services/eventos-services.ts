import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  private apiUrl = 'http://localhost:7575/eventos';

  constructor() { }

  // 1. Obtener todos los eventos deportivos
  async obtenerEventos(): Promise<any[]> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerEventos:', error);
      throw error;
    }
  }

  // 2. Crear un nuevo evento
  async crearEvento(evento: any): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evento)
      });
      return await response.text();
    } catch (error) {
      console.error('Error en crearEvento:', error);
      return 'Error al conectar con el servidor';
    }
  }

  // 3. Actualizar un evento existente
  async actualizarEvento(evento: any): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/actualizar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evento)
      });
      return await response.text();
    } catch (error) {
      console.error('Error en actualizarEvento:', error);
      return 'Error al conectar con el servidor';
    }
  }

  // 4. Eliminar un evento de la BD
  async eliminarEvento(id: number): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/eliminar/${id}`, {
        method: 'DELETE'
      });
      return await response.text();
    } catch (error) {
      console.error('Error en eliminarEvento:', error);
      return 'Error al conectar con el servidor';
    }
  }
}