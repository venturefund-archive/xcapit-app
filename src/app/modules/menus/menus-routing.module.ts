import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'menus',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'main-menu',
        loadChildren: () =>
          import('./main-menu/main-menu.module').then(
            m => m.MainMenuPageModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenusRoutingModule { }
