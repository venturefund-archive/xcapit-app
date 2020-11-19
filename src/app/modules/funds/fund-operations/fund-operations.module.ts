import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundOperationsPage } from './fund-operations.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';
import { SymbolFormatComponent } from './components/symbol-format/symbol-format.component';

const routes: Routes = [
  {
    path: '',
    component: FundOperationsPage,
  },
];

@NgModule({
  imports: [SharedFundsModule, RouterModule.forChild(routes)],
  declarations: [FundOperationsPage, SymbolFormatComponent],
})
export class FundOperationsPageModule {}
