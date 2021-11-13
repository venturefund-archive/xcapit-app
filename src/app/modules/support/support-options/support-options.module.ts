import { NgModule } from '@angular/core';
import { SupportOptionsPage } from './support-options.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedSupportModule } from '../shared-support/shared-support.module';
import { SupportOptionsCardComponent } from '../shared-support/components/support-options-card/support-options-card.component';
import { ContactSupportComponent } from '../shared-support/components/contact-support/contact-support.component';
const routes: Routes = [
  {
    path: '',
    component: SupportOptionsPage,
  },
];
@NgModule({
  imports: [SharedSupportModule, RouterModule.forChild(routes)],
  declarations: [SupportOptionsPage],
})
export class SupportOptionsPageModule {}
