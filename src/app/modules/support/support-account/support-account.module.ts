import { NgModule } from '@angular/core';
import { SupportAccountPage } from './support-account.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedSupportModule } from '../shared-support/shared-support.module';
import { ContactSupportComponent } from '../shared-support/components/contact-support/contact-support.component';
import { FaqComponent } from '../shared-support/components/faq/faq.component';

const routes: Routes = [
  {
    path: '',
    component: SupportAccountPage,
  },
];

@NgModule({
  imports: [SharedSupportModule, RouterModule.forChild(routes)],
  declarations: [SupportAccountPage, FaqComponent],
})
export class SupportAccountPageModule {}
