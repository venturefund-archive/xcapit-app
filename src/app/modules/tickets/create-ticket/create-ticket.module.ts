import { NgModule } from '@angular/core';

import { CreateTicketPage } from './create-ticket.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedTicketsModule } from '../shared-tickets/shared-tickets.module';

const routes: Routes = [
  {
    path: '',
    component: CreateTicketPage,
  },
];

@NgModule({
  imports: [SharedTicketsModule, RouterModule.forChild(routes)],
  declarations: [CreateTicketPage],
})
export class CreateTicketPageModule {}
