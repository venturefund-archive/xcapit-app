import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'apikeys',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'success/:type',
        canActivate: [],
        loadChildren: () => import('./success-apikeys/success-apikeys.module').then((m) => m.SuccessApikeysPageModule),
      },
      {
        path: 'register',
        canActivate: [],
        loadChildren: () =>
          import('../apikeys/register-apikeys/register-apikeys.module').then((m) => m.RegisterApikeysPageModule),
      },
      {
        path: 'success-register',
        canActivate: [],
        loadChildren: () =>
          import('./success-register-apikeys/success-register-apikeys.module').then(
            (m) => m.SuccessRegisterApikeysPageModule
          ),
      },
      {
        path: 'success-register-beginner',
        canActivate: [],
        loadChildren: () =>
          import('./success-register-apikeys-beginner/success-register-apikeys-beginner.module').then(
            (m) => m.SuccessRegisterApikeysBeginnerPageModule
          ),
      },
      {
        path: 'list',
        canActivate: [],
        loadChildren: () => import('./list-apikeys/list-apikeys.module').then((m) => m.ListApikeysPageModule),
      },
      {
        path: 'scan',
        loadChildren: () => import('./scan-qr/scan-qr.module').then((m) => m.ScanQrPageModule),
      },
      {
        path: 'tutorial',
        children: [
          {
            path: 'exchange',
            loadChildren: () =>
              import('./tutorial-exchange/tutorial-exchange.module').then((m) => m.TutorialExchangePageModule),
          },
          {
            path: 'apikeys',
            loadChildren: () =>
              import('./tutorial-apikeys/tutorial-apikeys.module').then((m) => m.TutorialApikeysPageModule),
          },
          {
            path: 'register',
            loadChildren: () =>
              import('../apikeys/register-apikeys/register-apikeys.module').then((m) => m.RegisterApikeysPageModule),
          },
        ],
      },
      {
        path: 'whats-an-api-key',
        loadChildren: () => import('./whats-an-api-key/whats-an-api-key.module').then((m) => m.WhatsAnApiKeyPageModule),
      },
      {
        path: 'how-create-binance-account',
        loadChildren: () =>
          import('./how-create-binance-account/how-create-binance-account.module').then(
            (m) => m.HowCreateBinanceAccountPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApikeysRoutingModule {}
