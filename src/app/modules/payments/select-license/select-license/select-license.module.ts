import { NgModule } from '@angular/core';
import { SelectLicensePage } from './select-license.page';
import { RouterModule, Routes } from '@angular/router';
import { ItemLicenseComponent } from '../components/item-license/item-license.component';
import { SharedPaymentsModule } from '../../shared-payments/shared-payments.module';

const routes: Routes = [
  {
    path: '',
    component: SelectLicensePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedPaymentsModule],
  declarations: [SelectLicensePage, ItemLicenseComponent],
})
export class SelectLicensePageModule {}
