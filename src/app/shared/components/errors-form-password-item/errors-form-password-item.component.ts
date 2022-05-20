import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroupDirective } from '@angular/forms';
import { ItemFormError } from '../../models/item-form-error';

@Component({
  selector: 'app-errors-form-password-item',
  template: `
    <div class="password-error-item ux-font-text-xxs" *ngFor="let error of processedErrors">
      <ion-icon *ngIf="error.present" name="ux-info-circle-outline" color="warningdark"> </ion-icon>
      <ion-icon *ngIf="!error.present" name="ux-checked-circle-outline" color="successdark"> </ion-icon>
      <ion-label class="password-error-item__description" [color]="error.present ? 'warningdark' : 'successdark'">{{
        error.text | translate
      }}</ion-label>
    </div>
  `,
  styleUrls: ['./errors-form-password-item.component.scss'],
})
export class ErrorsFormPasswordItemComponent implements OnInit {
  @Input() control: AbstractControl;
  @Input() errors: ItemFormError[];
  processedErrors: any[];
  constructor() {}

  ngOnInit() {
    this.processErrors();
    this.control.valueChanges.subscribe(() => {
      this.processErrors();
    });
  }

  processErrors() {
    this.processedErrors = this.errors.map((error) => {
      const value = {
        present: this.getError(error),
        text: error.text,
      };
      return value;
    });
  }

  getError(error) {
    if (!this.control.value) {
      return true;
    }
    return this.control.hasError(error.name);
  }
}
