import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubscribePage } from './subscribe.page';
import { SharedSubscriptionsModule } from '../shared-subscriptions/shared-subscriptions.module';

const routes: Routes = [
  {
    path: ':subscriptionToken/:fundNameb64',
    component: SubscribePage
  }
];

@NgModule({
  imports: [
    SharedSubscriptionsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SubscribePage]
})
export class SubscribePageModule {}
