import { NgModule } from '@angular/core';
import { SupportBuyPage } from './support-buy.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedSupportModule } from '../shared-support/shared-support.module';

const routes: Routes = [
  {
    path: '',
    component: SupportBuyPage,
  },
];

@NgModule({
  imports: [SharedSupportModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [SupportBuyPage],
})
export class SupportBuyPageModule {}
