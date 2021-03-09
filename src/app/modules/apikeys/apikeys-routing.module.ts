import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';
import { UserProfileDataGuard } from '../profiles/shared-profiles/guards/user-profile-data/user-profile-data.guard';
import { ApiKeyDataGuard } from './shared-apikeys/guards/apikey-data/apikey-data.guard';

const routes: Routes = [
  {
    path: 'apikeys',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'tutorial',
        canActivate: [UserProfileDataGuard],
        loadChildren: () =>
          import('./tutorial-apikeys/tutorial-apikeys.module').then(
            (m) => m.TutorialApikeysPageModule
          ),
      },
      {
        path: 'insert-key',
        canActivate: [UserProfileDataGuard],
        loadChildren: () =>
          import('./insert-key/insert-key.module').then(
            (m) => m.InsertKeyPageModule
          ),
      },
      {
        path: 'insert-secret',
        canActivate: [UserProfileDataGuard, ApiKeyDataGuard],
        loadChildren: () =>
          import('./insert-secret/insert-secret.module').then(
            (m) => m.InsertSecretPageModule
          ),
      },
      {
        path: 'success/:type',
        canActivate: [UserProfileDataGuard],
        loadChildren: () =>
          import('./success-apikeys/success-apikeys.module').then(
            (m) => m.SuccessApikeysPageModule
          ),
      },
      {
        path: 'register',
        canActivate: [UserProfileDataGuard],
        loadChildren: () =>
          import('../apikeys/register-apikeys/register-apikeys.module').then(
            (m) => m.RegisterPageModule
          ),
      },
      {
        path: 'success-register',
        canActivate: [UserProfileDataGuard],
        loadChildren: () =>
          import('./success-register-apikeys/success-register-apikeys.module').then(
            (m) => m.SuccessRegisterPageModule
          ),
      },
      {
        path: 'list',
        canActivate: [UserProfileDataGuard],
        loadChildren: () =>
          import('./manage-apikeys/manage-apikeys.module').then((m) => m.ListPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApikeysRoutingModule {}
