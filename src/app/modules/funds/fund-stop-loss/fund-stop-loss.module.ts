import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FundStopLossPage } from './fund-stop-loss.page';

const routes: Routes = [
  {
    path: '',
    component: FundStopLossPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FundStopLossPage]
})
export class FundStopLossPageModule {}
