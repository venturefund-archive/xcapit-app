import { NgModule } from '@angular/core';
import { BackupPage } from './backup.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedProfilesModule } from '../shared-profiles/shared-profiles.module';

const routes: Routes = [
  {
    path: '',
    component: BackupPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedProfilesModule],
  exports: [RouterModule],
  declarations: [BackupPage],
})
export class BackupPageModule {}
