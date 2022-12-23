import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedProfilesModule } from '../../profiles/shared-profiles/shared-profiles.module';
import { ContactsHomePage } from './contacts-home.page';

const routes: Routes = [
  {
    path: '',
    component: ContactsHomePage,
  },
];

@NgModule({
  imports: [SharedProfilesModule, RouterModule.forChild(routes)],
  declarations: [ContactsHomePage],
})
export class ContactsHomePageModule {}
