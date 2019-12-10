import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';
import { UserProfileDataGuard } from '../profiles/shared-profiles/guards/user-profile-data/user-profile-data.guard';

const routes: Routes = [
  {
    path: 'apikeys',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'action',
        canActivate: [UserProfileDataGuard],
        loadChildren: () =>
          import('./new-apikeys/new-apikeys.module').then(
            m => m.NewApikeysPageModule
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
