import { NgModule } from '@angular/core';
import { SubModuleInformationPage } from './sub-module-information.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedFinancialEducationModule } from '../shared-financial-education/shared-financial-education.module';
import { SubModuleInfoComponent } from '../shared-financial-education/components/sub-module-info/sub-module-info.component';

const routes: Routes = [
  {
    path: 'tab/:tab/module/:module/submodule/:submodule',
    component: SubModuleInformationPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedFinancialEducationModule],
  declarations: [SubModuleInformationPage, SubModuleInfoComponent],
})
export class SubModuleInformationPageModule {}
