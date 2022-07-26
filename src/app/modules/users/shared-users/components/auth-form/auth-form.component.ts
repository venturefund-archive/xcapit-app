import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { CustomValidatorErrors } from 'src/app/shared/validators/custom-validator-errors';
import { CONFIG } from 'src/app/config/app-constants.config';
import { ItemFormError } from 'src/app/shared/models/item-form-error';
import { ToastService } from 'src/app/shared/services/toast/toast.service';

@Component({
  selector: 'app-auth-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()">
        <app-ux-input
          controlName="email"
          type="email"
          inputmode="email"
          label="Email"
          [errors]="this.emailErrors"
          aria-label="email"
          tabindex="0"
          (click)="this.dismissToast()"
        ></app-ux-input>

        <app-ux-input
          controlName="password"
          type="password"
          inputmode="password"
          [label]="'users.login.password_label' | translate"
          [errors]="this.passwordErrors"
          aria-label="password"
          tabindex="1"
          (click)="this.dismissToast()"
        ></app-ux-input>

        <app-ux-input
          class="ux-font-text-xs"
          *ngIf="this.showReferralCode"
          controlName="referral_code"
          type="text"
          inputmode="text"
          [label]="'users.register.referral_code_label' | translate"
          (click)="this.dismissToast()"
        ></app-ux-input>

        <ion-item class="tos_item" *ngIf="!this.isLogin">
          <ng-content select=".tos-text"></ng-content>

          <app-ux-checkbox *ngIf="!this.isLogin" class="small" controlName="tos" slot="start"></app-ux-checkbox>
        </ion-item>

        <ng-content select=".auth-button"></ng-content>

        <ng-content select=".auth-link-reset-password"></ng-content>

        <ng-content select=".auth-link"></ng-content>
      </form>
    </div>
  `,
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent implements OnInit {
  @Input()
  isLogin = false;

  @Output()
  send = new EventEmitter<any>();

  showReferralCode: boolean = true;

  emailErrors: ItemFormError[] = CONFIG.fieldErrors.username;

  passwordErrors: ItemFormError[] = CONFIG.fieldErrors.password;

  form: UntypedFormGroup = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
        CustomValidators.patternValidator(/\d/, CustomValidatorErrors.hasNumber),
        CustomValidators.patternValidator(/[A-Z]/, CustomValidatorErrors.hasCapitalCase),
        CustomValidators.patternValidator(/[a-z]/, CustomValidatorErrors.hasSmallCase),
      ],
    ],
    referral_code: [''],
    tos: [false, [Validators.required, CustomValidators.mustBeTrue]],
  });

  constructor(private formBuilder: UntypedFormBuilder, private toastService: ToastService) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    if (this.isLogin) {
      this.showReferralCode = false;
      this.form.get('tos').disable();
    }
  }

  handleSubmit() {
    if (this.form.valid) {
      this.send.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  dismissToast() {
    this.toastService.dismiss();
  }
}
