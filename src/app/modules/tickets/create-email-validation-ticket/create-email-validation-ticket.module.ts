import { NgModule } from '@angular/core';

import { CreateEmailValidationTicketPage } from './create-email-validation-ticket.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedTicketsModule } from '../shared-tickets/shared-tickets.module';

const routes: Routes = [
  {
    path: ':email',
    component: CreateEmailValidationTicketPage,
  },
];

@NgModule({
  imports: [SharedTicketsModule, RouterModule.forChild(routes)],
  declarations: [CreateEmailValidationTicketPage],
})
export class CreateEmailValidationTicketPageModule {}
