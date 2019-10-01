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
      <ion-item-group>
        <div class="ion-padding-start ion-padding-end">
          <ion-item>
            <ion-label position="floating">
              {{ 'referrals.referral_form.email' | translate }}
            </ion-label>
            <ion-input formControlName="email" type="email"></ion-input>
          </ion-item>
          <app-errors-form-item
            controlName="email"
            [errors]="this.emailErrors"
          ></app-errors-form-item>
        </div>

        <ng-content select=".submit-button"></ng-content>
      </ion-item-group>
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

  constructor(private formBuilder: FormBuilder) {}

  handleSubmit() {
    if (this.form.valid) {
      this.send.emit(this.form.value);
    }
  }
}
