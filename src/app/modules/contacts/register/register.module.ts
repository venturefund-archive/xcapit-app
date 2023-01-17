import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedContactsModule } from '../shared-contacts/shared-contacts.module';
import { RegisterPage } from './register.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterPage,
  },
  {
    path: ':mode/blockchain/:blockchain/address/:address',
    component: RegisterPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedContactsModule
  ],
  declarations: [RegisterPage]
})
export class RegisterPageModule {}
