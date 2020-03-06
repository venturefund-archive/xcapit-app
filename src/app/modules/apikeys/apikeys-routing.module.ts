import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';
import { UserProfileDataGuard } from '../profiles/shared-profiles/guards/user-profile-data/user-profile-data.guard';
import { ApiKeyDataGuard } from './shared-apikeys/guards/apikey-data/apikey-data.guard';
import { NoEmptyAKGuard } from './shared-apikeys/guards/no-empty-ak/no-empty-ak.guard';

const routes: Routes = [
  {
    path: 'apikeys',
    canActivate: [AuthGuard, NoEmptyAKGuard],
    children: [
      {
        path: 'action',
        canActivate: [UserProfileDataGuard],
        loadChildren: () =>
          import('./new-apikeys/new-apikeys.module').then(
            m => m.NewApikeysPageModule
          )
      },
      {
        path: 'tutorial',
        canActivate: [UserProfileDataGuard],
        loadChildren: () =>
          import('./tutorial-apikeys/tutorial-apikeys.module').then(
            m => m.TutorialApikeysPageModule
          )
      },
      {
        path: 'insert-key',
        canActivate: [UserProfileDataGuard],
        loadChildren: () =>
          import('./insert-key/insert-key.module').then(
            m => m.InsertKeyPageModule
          )
      },
      {
        path: 'insert-secret',
        canActivate: [UserProfileDataGuard, ApiKeyDataGuard],
        loadChildren: () =>
          import('./insert-secret/insert-secret.module').then(
            m => m.InsertSecretPageModule
          )
      },
      {
        path: 'success',
        canActivate: [UserProfileDataGuard],
        loadChildren: () =>
          import('./success-apikeys/success-apikeys.module').then(
            m => m.SuccessApikeysPageModule
          )
      },
      {
        path: 'linked',
        loadChildren: () =>
          import('./linked-apikeys/linked-apikeys.module').then(
            m => m.LinkedApikeysPageModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApikeysRoutingModule {}
