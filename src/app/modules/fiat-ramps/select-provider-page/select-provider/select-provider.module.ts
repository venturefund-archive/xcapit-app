import { NgModule } from '@angular/core';
import { SelectProviderPage } from './select-provider.page';
import { RouterModule, Routes } from '@angular/router';
import { ProviderCardComponent } from '../components/provider-card/provider-card/provider-card.component';
import { SharedRampsModule } from '../../shared-ramps/shared-ramps.module';

const routes: Routes = [
  {
    path: '',
    component: SelectProviderPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedRampsModule],
  declarations: [SelectProviderPage, ProviderCardComponent],
})
export class SelectProviderPageModule {}
