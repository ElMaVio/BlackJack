import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl = environment.urlUser;

  constructor() { }

  async obtenerUsuarios(): Promise<any[]> {
    try {
      console.log('Llamando a la URL de usuarios:', this.apiUrl);
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      return await response.json();
    } catch (error) {
      console.error('Error crítico en obtenerUsuarios:', error);
      return [];
    }
  }

  async crearUsuario(usuario: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
      });
      return response.ok;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async actualizarUsuario(usuario: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/actualizar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
      });
      return response.ok;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async eliminarUsuario(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/eliminar/${id}`, {
        method: 'DELETE'
      });
      return response.ok;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}