import { NgModule } from '@angular/core';
import { DeleteAccountPage } from './delete-account.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedProfilesModule } from '../shared-profiles/shared-profiles.module';

const routes: Routes = [
  {
    path: '',
    component: DeleteAccountPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedProfilesModule],
  declarations: [DeleteAccountPage],
})
export class DeleteAccountPageModule {}
