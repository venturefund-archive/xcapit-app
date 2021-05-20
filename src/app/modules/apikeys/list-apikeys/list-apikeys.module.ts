import { NgModule } from '@angular/core';
import { ListApikeysPage } from './list-apikeys.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedApikeysModule } from '../shared-apikeys/shared-apikeys.module';
import { ApikeyItemComponent } from '../shared-apikeys/components/apikey-item/apikey-item.component';
import { ApikeysEditModalComponent } from '../shared-apikeys/components/apikeys-edit-modal/apikeys-edit-modal.component';

const routes: Routes = [
  {
    path: ':mode',
    component: ListApikeysPage
  }, {
    path: '',
    component: ListApikeysPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedApikeysModule],
  declarations: [
    ListApikeysPage,
    ApikeyItemComponent,
    ApikeysEditModalComponent
  ]
})
export class ListApikeysPageModule {
}
