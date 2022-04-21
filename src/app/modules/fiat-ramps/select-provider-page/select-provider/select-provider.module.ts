import { NgModule } from '@angular/core';
import { SelectProviderPage } from './select-provider.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampsModule } from '../../shared-ramps/shared-ramps.module';

const routes: Routes = [
  {
    path: '',
    component: SelectProviderPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedRampsModule],
  declarations: [SelectProviderPage],
})
export class SelectProviderPageModule {}
