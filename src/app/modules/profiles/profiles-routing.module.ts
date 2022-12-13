import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../users/shared-users/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'profiles',
    children: [
      {
        path: 'user',
        canActivate: [AuthGuard],
        loadChildren: () => import('./user-profile/user-profile.module').then((m) => m.UserProfilePageModule),
      },
      {
        path: 'success',
        canActivate: [AuthGuard],
        loadChildren: () => import('./success-profile/success-profile.module').then((m) => m.SuccessProfilePageModule),
      },
      {
        path: 'menu',
        loadChildren: () =>
          import('./user-profile-menu/user-profile-menu.module').then((m) => m.UserProfileMenuPageModule),
      },
      {
        path: 'profile-test',
        loadChildren: () =>
          import('./personalised-profile-test/personalised-profile-test.module').then(
            (m) => m.PersonalisedProfileTestPageModule
          ),
      },
      {
        path: 'success-profile-test',
        loadChildren: () =>
          import('./success-profile-test/success-profile-test.module').then((m) => m.SuccessProfileTestPageModule),
      },
      {
        path: 'biometric-auth',
        loadChildren: () => import('./biometric-auth/biometric-auth.module').then((m) => m.BiometricAuthPageModule),
      },
      {
        path: 'wallets-agenda',
        loadChildren: () => import('./wallets-agenda-home/wallets-agenda-home.module').then((m) => m.WalletsAgendaHomePageModule),
      },
      {
        path: 'delete-account',
        loadChildren: () => import('./delete-account/delete-account.module').then((m) => m.DeleteAccountPageModule),
      },
      {
        path: 'success-delete-account',
        loadChildren: () =>
          import('./success-delete-account/success-delete-account.module').then(
            (m) => m.SuccessDeleteAccountPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilesRoutingModule {}
