import { NgModule } from '@angular/core';
import { WarrantySummaryPage } from './warranty-summary.page';
import { SharedContactsModule } from '../shared-contacts/shared-contacts.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: WarrantySummaryPage ,
  },
];


@NgModule({
  imports: [
    SharedContactsModule, RouterModule.forChild(routes)
  ],
  declarations: [WarrantySummaryPage]
})
export class WarrantySummaryPageModule {}
