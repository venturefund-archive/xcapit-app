import { NgModule } from '@angular/core';
import { ManageApikeysPage } from './manage-apikeys.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedApikeysModule } from '../shared-apikeys/shared-apikeys.module';
import { ApikeysEditModalComponent } from '../shared-apikeys/components/apikeys-edit-modal/apikeys-edit-modal.component';

const routes: Routes = [
  {
    path: '',
    component: ManageApikeysPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedApikeysModule],
  declarations: [ManageApikeysPage, ApikeysEditModalComponent],
})
export class ManageApikeysPageModule {}
