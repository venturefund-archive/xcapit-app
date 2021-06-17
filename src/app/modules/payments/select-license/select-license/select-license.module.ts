import { NgModule } from '@angular/core';
import { SelectLicensePage } from './select-license.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ItemLicenseComponent } from '../components/item-license/item-license.component';

const routes: Routes = [
  {
    path: '',
    component: SelectLicensePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [SelectLicensePage, ItemLicenseComponent],
})
export class SelectLicensePageModule {}
