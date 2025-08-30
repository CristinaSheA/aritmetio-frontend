import { Routes } from '@angular/router';
import { AuthComponent } from './features/pages/auth/auth.component';
import { ModeSelectorComponent } from './features/pages/mode-selector/mode-selector.component';
import { GameComponent } from './features/pages/game/game.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'mode-selector',
    component: ModeSelectorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'game/:mode',
    component: GameComponent,
    canActivate: [AuthGuard],
  },
  {
    
    path: 'auth',
    component: AuthComponent,
  },
  { path: '', redirectTo: 'mode-selector', pathMatch: 'full' },
  {
    path: '**',
    redirectTo: 'mode-selector',
  },
];
