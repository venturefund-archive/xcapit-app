import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundRunsPage } from './fund-runs.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';
import { CommissionsModalComponent } from '../shared-funds/components/commissions-modal/commissions-modal.component';

const routes: Routes = [
  {
    path: '',
    component: FundRunsPage
  }
];

@NgModule({
  imports: [SharedFundsModule, RouterModule.forChild(routes)],
  declarations: [FundRunsPage],
  entryComponents: [CommissionsModalComponent]
})
export class FundRunsPageModule {}
