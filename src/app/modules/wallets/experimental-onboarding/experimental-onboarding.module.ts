import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';
import { ExperimentalOnboardingPage } from './experimental-onboarding.page';

const routes: Routes = [
  {
    path: '',
    component: ExperimentalOnboardingPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [ExperimentalOnboardingPage],
})
export class ExperimentalOnboardingPageModule {}
