import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectProviderPage } from './select-provider.page';
import { RouterModule, Routes } from '@angular/router';
import { ProviderCardComponent } from '../components/provider-card/provider-card/provider-card.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: SelectProviderPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [SelectProviderPage, ProviderCardComponent],
})
export class SelectProviderPageModule {}
