import { NgModule } from '@angular/core';
import { FaqsPage } from './faqs.page';
import { SharedSupportModule } from '../shared-support/shared-support.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: FaqsPage,
  },
  {
    path: ':topic',
    component: FaqsPage,
  },
];

@NgModule({
  imports: [
    SharedSupportModule, RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [FaqsPage]
})
export class FaqsPageModule {}
