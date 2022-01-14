import { NgModule } from '@angular/core';
import { ComingSoonPage } from './coming-soon.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedDefiInvestmentsModule } from '../shared-defi-investments/shared-defi-investments.module';

const routes: Routes = [
  {
    path: '',
    component: ComingSoonPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedDefiInvestmentsModule],
  declarations: [ComingSoonPage],
})
export class ComingSoonPageModule {}
