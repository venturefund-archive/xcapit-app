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
      {
        path: 'home',
        loadChildren: () => import('./contacts-home/contacts-home.module').then((m) => m.ContactsHomePageModule),
      },
      {
        path: 'detail',
        loadChildren: () => import('./contact-detail/contact-detail.module').then( m => m.ContactDetailPageModule)
      },    
      {
        path: 'warranty-summary',
        loadChildren: () => import('./warranty-summary/warranty-summary.module').then( m => m.WarrantySummaryPageModule)
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactsRoutingModule {}
