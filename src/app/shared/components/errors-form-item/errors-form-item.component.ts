import { Component, OnInit, Input } from '@angular/core';
import { ItemFormError } from '../../models/item-form-error';
import { AbstractControl, FormGroupDirective, UntypedFormGroup } from '@angular/forms';
import { CONFIG } from 'src/app/config/app-constants.config';

@Component({
  selector: 'app-errors-form-item',
  template: `
    <div class="ux-error" *ngIf="this.invalid">
      <ion-item class="ux-error__item" lines="none">
        <ion-icon
          class="ux-error__item__icon"
          item-start
          name="ux-error"
          aria-hidden="“true”"
          *ngIf="this.newStyle"
        ></ion-icon>
        <p class="ux-error__item__message" [ngClass]="this.newStyle ? 'ux-font-text-xxs' : 'ux-font-form-errors'">
          {{ this.getError() | translate }}
        </p>
      </ion-item>
    </div>
  `,
  styleUrls: ['./errors-form-item.component.scss'],
})
export class ErrorsFormItemComponent implements OnInit {
  @Input() controlName: string;
  @Input() newStyle = false;
  @Input() errors: ItemFormError[];

  errorMessage: string;

  hasError = false;

  control: AbstractControl;
  parentForm: UntypedFormGroup;

  constructor(private form: FormGroupDirective) {}

  ngOnInit() {
    this.control = this.form.control.get(this.controlName);
    this.setErrors();
  }

  get valid() {
    return this.control && this.control.valid && this.control.touched;
  }

  get invalid() {
    return this.control && this.control.invalid && this.control.touched;
  }

  private setErrors() {
    if (Array.isArray(this.errors)) {
      this.errors = [
        ...CONFIG.formErrors.filter((item) => this.errors.every((i) => i.name !== item.name)),
        ...this.errors,
      ];
    } else {
      this.errors = CONFIG.formErrors;
    }
  }

  getError() {
    for (const error of this.errors) {
      this.errorMessage = this.getErrorMessage(error);
      if (this.errorMessage) {
        return this.errorMessage;
      }
    }
  }

  private getErrorMessage(error): string {
    this.errorMessage = this.control && this.control.hasError(error.name) && this.control.touched ? error.text : '';
    return this.errorMessage;
  }
}
