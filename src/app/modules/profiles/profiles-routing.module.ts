import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';

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
        path: 'personal-data',
        canActivate: [AuthGuard],
        loadChildren: () => import('./personal-data/personal-data.module').then((m) => m.PersonalDataPageModule),
      },
      {
        path: 'fiscal-data',
        canActivate: [AuthGuard],
        loadChildren: () => import('./fiscal-data/fiscal-data.module').then((m) => m.FiscalDataPageModule),
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilesRoutingModule {}
