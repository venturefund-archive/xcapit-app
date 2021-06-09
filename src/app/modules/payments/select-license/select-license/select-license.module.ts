import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

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
