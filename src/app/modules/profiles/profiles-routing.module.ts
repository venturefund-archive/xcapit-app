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
        loadChildren: () =>
          import('./user-profile/user-profile.module').then(
            m => m.UserProfilePageModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilesRoutingModule {}
