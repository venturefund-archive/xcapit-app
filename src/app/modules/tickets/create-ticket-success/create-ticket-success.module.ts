import { NgModule } from '@angular/core';
import { CreateTicketSuccessPage } from './create-ticket-success.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedTicketsModule } from '../shared-tickets/shared-tickets.module';

const routes: Routes = [
  {
    path: '',
    component: CreateTicketSuccessPage,
  },
  {
    path: ':isEmailValidation',
    component: CreateTicketSuccessPage,
  },
];
@NgModule({
  imports: [SharedTicketsModule, RouterModule.forChild(routes)],
  declarations: [CreateTicketSuccessPage],
})
export class CreateTicketSuccessPageModule {}
