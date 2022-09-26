import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToolsPage } from './tools-page.page';
import { SharedHomeModule } from '../shared-home/shared-home.module';
import { IonicStorageModule } from '@ionic/storage';

const routes: Routes = [
  {
    path: '',
    component: ToolsPage,
  },
];

@NgModule({
  imports: [
    SharedHomeModule, RouterModule.forChild(routes), IonicStorageModule.forRoot()],
  declarations: [ToolsPage]
})
export class ToolsPageModule {}
