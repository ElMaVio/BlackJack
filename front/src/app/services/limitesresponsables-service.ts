import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LimitesService {
  // Consumimos la URL de los entornos (Puerto 7575)
  private baseUrl = environment.urlLimites; 

  constructor() {}

  // 1. Obtener todos los límites de la base de datos
  async obtenerLimites(): Promise<any[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) throw new Error('Error al obtener límites');
      return await response.json();
    } catch (error) {
      console.error('Error en el servicio de límites:', error);
      return [];
    }
  }

  // 2. Registrar un nuevo límite para un usuario
  async crearLimite(limite: any): Promise<string> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(limite)
      });
      return await response.text();
    } catch (error) {
      console.error('Error al crear límite:', error);
      return 'Error de conexión';
    }
  }

  // 3. Modificar un límite existente
  async actualizarLimite(limite: any): Promise<string> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(limite)
      });
      return await response.text();
    } catch (error) {
      console.error('Error al actualizar límite:', error);
      return 'Error de conexión';
    }
  }

  // 4. Eliminar el registro de un límite
  async eliminarLimite(id: number): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE'
      });
      return await response.text();
    } catch (error) {
      console.error('Error al eliminar límite:', error);
      return 'Error de conexión';
    }
  }
}