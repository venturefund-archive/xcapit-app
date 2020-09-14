import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainMenuPage } from './main-menu.page';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: MainMenuPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MainMenuPage]
})
export class MainMenuPageModule {}
