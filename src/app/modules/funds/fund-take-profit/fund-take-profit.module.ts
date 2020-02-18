import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FundTakeProfitPage } from './fund-take-profit.page';

const routes: Routes = [
  {
    path: '',
    component: FundTakeProfitPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FundTakeProfitPage]
})
export class FundTakeProfitPageModule {}
