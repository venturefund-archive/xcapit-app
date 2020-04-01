import { NgModule } from '@angular/core';
import { ManageApikeysPage } from './manage-apikeys.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedApikeysModule } from '../shared-apikeys/shared-apikeys.module';
import { ApikeyItemComponent } from '../components/apikey-item/apikey-item.component';

const routes: Routes = [
  {
    path: '',
    component: ManageApikeysPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes), 
    SharedApikeysModule,
    
  ],
  declarations: [ManageApikeysPage,ApikeyItemComponent ]
})
export class ListPageModule {}
