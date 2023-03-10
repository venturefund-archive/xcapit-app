import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WhatsappSupportComponent } from '../../shared/components/whatsapp-support/whatsapp-support.component';
import { WarrantiesRoutingModule } from './warranties-routing.module';

@NgModule({
  declarations: [],
  imports: [WarrantiesRoutingModule, FormsModule, ReactiveFormsModule],
})
export class WarrantiesModule {}
