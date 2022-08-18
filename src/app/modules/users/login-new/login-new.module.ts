import { NgModule } from '@angular/core';
import { LoginNewPage } from './login-new.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedUsersModule } from '../shared-users/shared-users.module';
import { NoAuthNewGuard } from '../shared-users/guards/no-auth-new/no-auth-new.guard';
import { HasWallet } from '../../../shared/guards/has-wallet/has-wallet';

const routes: Routes = [
  {
    canActivate: [HasWallet, NoAuthNewGuard],
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
