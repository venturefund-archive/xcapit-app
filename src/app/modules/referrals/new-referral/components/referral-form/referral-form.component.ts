import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemFormError } from 'src/app/shared/models/item-form-error';
import { CONFIG } from 'src/app/config/app-constants.config';

@Component({
  selector: 'app-referral-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()">
          <div class="rf__input ion-padding-start ion-padding-end">
              <app-ux-input
                      controlName="email"
                      type="text"
                      inputmode="text"
                      [label]=""
                      [placeholder]="'referrals.new_referral.email_placeholder' | translate
              "
                      [errors]="this.emailErrors"
              ></app-ux-input>
          </div>

          <ng-content select=".submit-button"></ng-content>
      </form>
  `,
  styleUrls: ['./referral-form.component.scss']
})
export class ReferralFormComponent {
  @Output()
  send = new EventEmitter<any>();

  emailErrors: ItemFormError[] = CONFIG.fieldErrors.username;

  form: FormGroup = this.formBuilder.group({
    email: [
      '',
      [
        Validators.email,
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ]
    ]
  });

  constructor(private formBuilder: FormBuilder) {
  }

  handleSubmit() {
    if (this.form.valid) {
      this.send.emit(this.form.value);
    }
  }
}
