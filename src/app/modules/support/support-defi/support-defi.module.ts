import { NgModule } from '@angular/core';
import { SupportDefiPage } from './support-defi.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedSupportModule } from '../shared-support/shared-support.module';

const routes: Routes = [
  {
    path: '',
    component: SupportDefiPage,
  },
];

@NgModule({
  imports: [SharedSupportModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [SupportDefiPage],
})
export class SupportDefiPageModule {}
