import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './home.page';
import { SharedHomeModule } from '../home/shared-home/shared-home.module';
import { IonicStorageModule } from '@ionic/storage';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
];

@NgModule({
  imports: [SharedHomeModule, RouterModule.forChild(routes), IonicStorageModule.forRoot()],
  declarations: [HomePage],
})
export class HomePageModule {}
