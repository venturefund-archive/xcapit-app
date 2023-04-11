import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { SendWarrantyPage } from './send-warranty.page';

const routes: Routes = [
  {
    path: '',
    component: SendWarrantyPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [SendWarrantyPage],
})
export class SendWarrantyPageModule {}
