import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './home.page';
import { SharedHomeModule } from '../home/shared-home/shared-home.module';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
];

@NgModule({
  imports: [SharedHomeModule, RouterModule.forChild(routes)],
  declarations: [HomePage],
})
export class HomePageModule {}
