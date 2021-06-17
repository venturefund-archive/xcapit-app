import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateSupportTicketPage } from './create-support-ticket.page';
import { SharedTicketsModule } from '../shared-tickets/shared-tickets.module';

const routes: Routes = [
  {
    path: '',
    component: CreateSupportTicketPage,
  },
];

@NgModule({
  imports: [SharedTicketsModule, RouterModule.forChild(routes)],
  declarations: [CreateSupportTicketPage],
})
export class CreateSupportTicketPageModule {}
