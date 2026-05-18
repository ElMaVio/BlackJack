import { Routes } from '@angular/router';
import { VerJuegosComponent } from './pages/ver-juegos-component/ver-juegos-component';
import { VerUsuariosComponent } from './pages/usuarios-component/usuarios-component';
import { BilleteraComponent } from './pages/billetera-component/billetera-component';
import { LimitesresponsablesComponent } from './pages/limitesresponsables-component/limitesresponsables-component';
import { EventosComponent } from './pages/eventos-component/eventos-component';
import { ApuestasComponent } from './pages/apuestas-component/apuestas-component';

export const routes: Routes = [
  {
    path: 'juegos',
    component: VerJuegosComponent
  },
  {
    path: 'usuarios',
    component: VerUsuariosComponent
  },
  {
    path: 'billetera',
    component: BilleteraComponent
  },
  { path: 'limites',
     component: LimitesresponsablesComponent
  },
  {
    path: 'eventos',
    component: EventosComponent
  },
  {
    path: 'apuestas',
    component: ApuestasComponent
  },

];
