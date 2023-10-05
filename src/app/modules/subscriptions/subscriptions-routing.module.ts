import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'subscriptions',
    children: [
      {
        path: 'subscribe/:subscriptionToken/:fundNameb64',
        loadChildren: () =>
          import('./subscribe/subscribe.module').then(
            m => m.SubscribePageModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionsRoutingModule {}
