import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalDataPage } from './personal-data.page';
import { SharedProfilesModule } from '../shared-profiles/shared-profiles.module';

const routes: Routes = [
  {
    path: '',
    component: PersonalDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedProfilesModule],
  declarations: [PersonalDataPage]
})
export class PersonalDataPageModule {}
