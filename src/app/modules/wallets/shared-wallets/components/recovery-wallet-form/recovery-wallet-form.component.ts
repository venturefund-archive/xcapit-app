import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroupDirective } from '@angular/forms';
import { CONFIG } from 'src/app/config/app-constants.config';

@Component({
  selector: 'app-recovery-wallet-form',
  template: `
    <div class="main">
      <app-ux-textarea controlName="phrase" inputmode="text" [errors]="this.errors" [useNewErrors]="true"></app-ux-textarea>
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
  @Input() controlName: string;
  control: AbstractControl;
  errors: any[] = CONFIG.fieldErrors.recoverWalletPhrase;
  constructor(
    private formGroupDirective: FormGroupDirective,
  ) {}

  ngOnInit() {
    this.control = this.formGroupDirective.form.get(this.controlName);
  }
}
