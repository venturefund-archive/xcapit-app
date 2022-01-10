import { NgModule } from '@angular/core';
import { ErrorInvestmentPage } from './error-investment.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedWealthManagementsModule } from '../../../wealth-managements/shared-wealth-managements/shared-wealth-managements.module';

const routes: Routes = [
  {
    path: '',
    component: ErrorInvestmentPage
  }
];

@NgModule({
  imports: [SharedWealthManagementsModule ,RouterModule.forChild(routes)],
  declarations: [ErrorInvestmentPage],
})
export class ErrorInvestmentPageModule {}
