import { NgModule } from '@angular/core';
import { SupportAccountPage } from './support-account.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedSupportModule } from '../shared-support/shared-support.module';
import { DesplegableComponent } from '../shared-support/components/desplegable/desplegable/desplegable.component';
import { ContactSupportComponent } from '../shared-support/components/contact-support/contact-support.component';

const routes: Routes = [
  {
    path: '',
    component: SupportAccountPage,
  },
];

@NgModule({
  imports: [SharedSupportModule, RouterModule.forChild(routes)],
  declarations: [SupportAccountPage, DesplegableComponent],
})
export class SupportAccountPageModule {}
