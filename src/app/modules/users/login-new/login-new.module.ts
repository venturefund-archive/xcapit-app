import { NgModule } from '@angular/core';
import { LoginNewPage } from './login-new.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedUsersModule } from '../shared-users/shared-users.module';
import { NoAuthGuard } from '../shared-users/guards/no-auth/no-auth.guard';
import { HasWallet } from '../../../shared/guards/has-wallet/has-wallet';

const routes: Routes = [
  {
    canActivate: [HasWallet, NoAuthGuard],
    data: { hasWalletFallbackUrl: '/users/on-boarding' },
    path: '',
    component: LoginNewPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedUsersModule],
  declarations: [LoginNewPage],
})
export class LoginNewPageModule {}
