import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsComponent } from './tabs/tabs.component';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'funds',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../funds/funds-list/funds-list.module').then(m => m.FundsListPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/funds',
        pathMatch: 'full'
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
export class TabsRoutingModule { }
