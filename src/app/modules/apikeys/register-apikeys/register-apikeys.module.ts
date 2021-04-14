import { NgModule } from '@angular/core';
import { RegisterApikeysPage } from './register-apikeys.page';
import { SharedApikeysModule } from '../shared-apikeys/shared-apikeys.module';
import { RouterModule, Routes } from '@angular/router';
import { QrScannerComponent } from '../shared-apikeys/components/qr-scanner/qr-scanner.component';

const routes: Routes = [
  {
    path: '',
    component: RegisterApikeysPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedApikeysModule],
  declarations: [RegisterApikeysPage, QrScannerComponent],
})
export class RegisterApikeysPageModule {}
