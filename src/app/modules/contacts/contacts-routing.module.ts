import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'contacts',
    canActivate: [],
    children: [
      {
        path: 'register',
        loadChildren: () => import('./register/register.module').then((m) => m.RegisterPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactsRoutingModule {}
