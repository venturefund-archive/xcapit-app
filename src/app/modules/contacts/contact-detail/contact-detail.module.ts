import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedContactsModule } from '../shared-contacts/shared-contacts.module';
import { ContactDetailPage } from './contact-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ContactDetailPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedContactsModule
  ],
  declarations: [ContactDetailPage]
})
export class ContactDetailPageModule {}
