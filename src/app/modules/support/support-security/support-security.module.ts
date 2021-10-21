import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupportSecurityPage } from './support-security.page';
import { SharedSupportModule } from '../shared-support/shared-support.module';
import { RouterModule, Routes } from '@angular/router';
import { FaqComponent } from '../shared-support/components/faq/faq.component';

const routes: Routes = [
  {
    path: '',
    component: SupportSecurityPage,
  },
];

@NgModule({
  imports: [SharedSupportModule, RouterModule.forChild(routes)],
  declarations: [SupportSecurityPage],
})
export class SupportSecurityPageModule {}
