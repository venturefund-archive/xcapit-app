import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-recovery-wallet-form',
  template: `
    <div class="main">
      <app-ux-textarea controlName="phrase" inputmode="text"></app-ux-textarea>
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
  constructor() {}

  ngOnInit() {}
}
