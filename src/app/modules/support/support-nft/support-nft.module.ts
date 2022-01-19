import { NgModule } from '@angular/core';
import { SupportNftPage } from './support-nft.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedSupportModule } from '../shared-support/shared-support.module';
const routes: Routes = [
  {
    path: '',
    component: SupportNftPage,
  },
];
@NgModule({
  imports: [
    SharedSupportModule, RouterModule.forChild(routes)
  ],
  declarations: [SupportNftPage]
})
export class SupportNftPageModule {}
