import { NgModule } from '@angular/core';
import { BiometricAuthPage } from './biometric-auth.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedProfilesModule } from '../shared-profiles/shared-profiles.module';

const routes: Routes = [
  {
    path: '',
    component: BiometricAuthPage,
  },
];

@NgModule({
  imports: [SharedProfilesModule, RouterModule.forChild(routes)],
  declarations: [BiometricAuthPage],
})
export class BiometricAuthPageModule {}
