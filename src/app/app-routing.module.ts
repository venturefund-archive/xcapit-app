import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NewLoginRedirectGuard } from './modules/home/shared-home/guards/new-login-redirect-guard';

const routes: Routes = [
  { canActivate: [NewLoginRedirectGuard], path: '', pathMatch: 'full', redirectTo: '/users/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
