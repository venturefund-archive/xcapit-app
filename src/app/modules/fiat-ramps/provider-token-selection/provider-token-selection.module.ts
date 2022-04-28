import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../shared-ramps/shared-ramps.module';
import { ProviderTokenSelectionPage } from './provider-token-selection.page';


const routes: Routes = [
  {
    path: '',
    component: ProviderTokenSelectionPage,
  },
];

@NgModule({
  imports: [SharedRampsModule, RouterModule.forChild(routes)],
  declarations: [ProviderTokenSelectionPage],
})
export class ProviderTokenSelectionPageModule {}
