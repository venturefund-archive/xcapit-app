import { NgModule } from '@angular/core';
import { HomeOfPurchasesPage } from './home-of-purchases.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';

const routes: Routes = [
  {
    path: '',
    component: HomeOfPurchasesPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedRampsModule],
  declarations: [HomeOfPurchasesPage],
})
export class HomeOfPurchasesPageModule {}
