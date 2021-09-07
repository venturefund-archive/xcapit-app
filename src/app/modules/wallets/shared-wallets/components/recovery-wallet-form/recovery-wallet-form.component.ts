import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

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
