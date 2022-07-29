import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedFinancialEducationModule } from '../shared-financial-education/shared-financial-education.module';
import { ErrorTestPage } from './error-test.page';

const routes: Routes = [
  {
    path: 'category/:category/module/:module/submodule/:submodule/code/:code',
    component: ErrorTestPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedFinancialEducationModule],
  declarations: [ErrorTestPage]
})
export class ErrorTestPageModule {}
