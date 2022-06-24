import { NgModule } from '@angular/core';
import { TestTypeformPage } from './test-typeform.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedFinancialEducationModule } from '../shared-financial-education/shared-financial-education.module';

const routes: Routes = [
  {
    path: 'tab/:tab/module/:module/submodule/:submodule/code/:code',
    component: TestTypeformPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedFinancialEducationModule],
  exports: [RouterModule],
  declarations: [TestTypeformPage],
})
export class TestTypeformPageModule {}
