import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { CONFIG } from 'src/app/config/app-constants.config';

@Component({
  selector: 'app-recovery-wallet-form',
  template: `
    <div class="main">
      <app-ux-textarea controlName="phrase" inputmode="text"></app-ux-textarea>
      <div class="wallet-recover-warning-item ux-font-text-xxs" *ngFor="let warning of processedWarnings">
        <ion-icon name="ux-info-circle-outline" color="infodark"></ion-icon>
        <ion-label class="wallet-recover-warning-item__description " color="infodark">{{
          warning.text | translate
        }}</ion-label>
      </div>
    </div>
  `,
  styleUrls: ['./recovery-wallet-form.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class RecoveryWalletFormComponent implements OnInit {
  processedWarnings: any[] = CONFIG.fieldErrors.recoverWalletPhrase
  constructor() {}

  ngOnInit() {}
}
