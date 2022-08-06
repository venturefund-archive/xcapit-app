import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalisedProfileTestPage } from './personalised-profile-test.page';
import { SharedProfilesModule } from '../shared-profiles/shared-profiles.module';

const routes: Routes = [
  {
    path: '',
    component: PersonalisedProfileTestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedProfilesModule],
  declarations: [PersonalisedProfileTestPage]
})
export class PersonalisedProfileTestPageModule {}
