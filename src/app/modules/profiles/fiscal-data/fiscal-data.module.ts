import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FiscalDataPage } from './fiscal-data.page';
import { SharedProfilesModule } from '../shared-profiles/shared-profiles.module';

const routes: Routes = [
  {
    path: '',
    component: FiscalDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedProfilesModule],
  declarations: [FiscalDataPage]
})
export class FiscalDataPageModule {}
