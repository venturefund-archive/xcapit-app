import { Component, OnInit, Input } from '@angular/core';
import { ItemFormError } from '../../models/item-form-error';
import {
  AbstractControl,
  FormGroupDirective,
  FormGroup
} from '@angular/forms';
import { CONFIG } from 'src/app/config/app-constants.config';

@Component({
  selector: 'app-errors-form-item',
  template: `
    <div *ngFor="let error of this.errors">
      <ion-item *ngIf="this.getErrorMessage(error)" lines="none">
        <p>
          {{ this.errorMessage | translate }}
        </p>
      </ion-item>
    </div>
  `,
  styleUrls: ['./errors-form-item.component.scss']
})

export class ErrorsFormItemComponent implements OnInit {
  @Input() controlName: string;

  @Input() errors: ItemFormError[];

  errorMessage: string;

  hasError = false;

  control: AbstractControl;
  parentForm: FormGroup;

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

  getErrorMessage(error: ItemFormError): string {
    this.errorMessage =
      this.control && this.control.hasError(error.name) && this.control.touched
        ? error.text
        : '';
    return this.errorMessage;
  }

  private setErrors() {
    if (Array.isArray(this.errors)) {
      this.errors = [
        ...CONFIG.formErrors.filter(item =>
          this.errors.every(i => i.name !== item.name)
        ),
        ...this.errors
      ];
    } else {
      this.errors = CONFIG.formErrors;
    }
  }
}
