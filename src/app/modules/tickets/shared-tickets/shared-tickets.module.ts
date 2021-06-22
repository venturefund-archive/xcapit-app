import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateTicketFormComponent } from './components/create-ticket-form/create-ticket-form.component';

@NgModule({
  declarations: [CreateTicketFormComponent],
  imports: [SharedModule],
  exports: [SharedModule, CreateTicketFormComponent],
})
export class SharedTicketsModule {}
