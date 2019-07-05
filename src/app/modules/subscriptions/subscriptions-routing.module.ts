import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubscribeGuard } from './shared-subscriptions/guards/subscribe/subscribe.guard';

const routes: Routes = [
  {
    path: 'subscriptions',
    children: [
      {
        path: 'subscribe',
        canActivate: [SubscribeGuard],
        loadChildren:
          './subscribe/subscribe.module#SubscribePageModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionsRoutingModule { }
