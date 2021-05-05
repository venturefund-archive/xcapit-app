import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperationsNewPage } from './operations-new.page';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: OperationsNewPage,
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [OperationsNewPage],
})
export class OperationsNewPageModule {}
