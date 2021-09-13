import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../usuarios/shared-usuarios/guards/auth/auth.guard';
import { ApiKeyDataGuard } from './shared-apikeys/guards/apikey-data/apikey-data.guard';

const routes: Routes = [
  {
    path: 'apikeys',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'tutorial',
        canActivate: [],
        loadChildren: () =>
          import('./tutorial-apikeys/tutorial-apikeys.module').then((m) => m.TutorialApikeysPageModule),
      },
      {
        path: 'insert-key',
        canActivate: [],
        loadChildren: () => import('./insert-key/insert-key.module').then((m) => m.InsertKeyPageModule),
      },
      {
        path: 'insert-secret',
        canActivate: [ApiKeyDataGuard],
        loadChildren: () => import('./insert-secret/insert-secret.module').then((m) => m.InsertSecretPageModule),
      },
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
        path: 'exchange-information',
        loadChildren: () =>
          import('./exchange-information/exchange-information.module').then((m) => m.ExchangeInformationPageModule),
      },
      {
        path: 'apikey-information',
        loadChildren: () =>
          import('./apikey-information/apikey-information.module').then((m) => m.ApikeyInformationPageModule),
      },
      {
        path: 'whats-an-api-key',
        loadChildren: () => import('./whats-an-api-key/whats-an-api-key.module').then((m) => m.WhatsAnApiKeyPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApikeysRoutingModule {}
