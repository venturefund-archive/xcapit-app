import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsComponent } from './tabs/tabs.component';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';
import { UserProfileDataGuard } from '../profiles/shared-profiles/guards/user-profile-data/user-profile-data.guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'funds',
        loadChildren: () =>
          import('../funds/funds-list/funds-list.module').then(
            m => m.FundsListPageModule
          )
      },
      {
        path: '',
        redirectTo: '/tabs/funds',
        pathMatch: 'full'
      },
      {
        path: 'refer',
        canActivate: [UserProfileDataGuard],
        loadChildren: () =>
          import('../referrals/new-referral/new-referral.module').then(
            m => m.NewReferralPageModule
          )
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/funds',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsRoutingModule {}
