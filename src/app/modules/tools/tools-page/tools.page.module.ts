import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToolsPage } from './tools.page';
import { IonicStorageModule } from '@ionic/storage-angular';
import { SharedToolsModule } from '../shared-tools/shared-tools.module';

const routes: Routes = [
  {
    path: '',
    component: ToolsPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes), IonicStorageModule.forRoot(), SharedToolsModule],
  declarations: [ToolsPage]
})
export class ToolsPageModule {}
