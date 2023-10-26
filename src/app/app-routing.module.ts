import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NewLogin } from './modules/users/shared-users/guards/new-login/new-login.guard';

const routes: Routes = [
  {
    canActivate: [NewLogin],
    data: { redirectUrl: '/tabs/wallets' },
    path: '',
    pathMatch: 'full',
    redirectTo: '/users/login-new',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
