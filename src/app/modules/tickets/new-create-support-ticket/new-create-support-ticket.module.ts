import { NgModule } from '@angular/core';
import { NewCreateSupportTicketPage } from './new-create-support-ticket.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedTicketsModule } from '../shared-tickets/shared-tickets.module';

const routes: Routes = [
  {
    path: '',
    component: NewCreateSupportTicketPage,
  },
];

@NgModule({
  imports: [SharedTicketsModule, RouterModule.forChild(routes)],
  declarations: [NewCreateSupportTicketPage],
})
export class NewCreateSupportTicketPageModule {}
