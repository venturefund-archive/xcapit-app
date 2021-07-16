import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective, AbstractControl } from '@angular/forms';
@Component({
  selector: 'app-ux-datetime',
  template: `
    <div class="ux_datetime_container">
      <ion-label class="ux_datetime_container__label">{{ this.label }}</ion-label>
      <ion-item class="ux_datetime_container__item">
        <ion-datetime
          [formControlName]="this.controlName"
          [displayFormat]="this.displayFormat"
          [cancelText]="'funds.fund_operations.cancel_datepicker_text' | translate"
          [doneText]="'funds.fund_operations.done_datepicker_text' | translate"
          [placeholder]="this.placeholder"
          [readonly]="this.readonly"
          [max]="this.max"
        ></ion-datetime>
        <ion-icon [name]="'ux-calendar'" slot="end"></ion-icon>
      </ion-item>
      <app-errors-form-item
        class="ux_datetime_container__item__errors"
        [controlName]="this.controlName"
        [errors]="this.errors"
      ></app-errors-form-item>
    </div>
  `,
  styleUrls: ['./ux-datetime.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class UxDatetimeComponent implements OnInit {
  @Input() label: string;
  @Input() errors: any[] = [];
  @Input() controlName: string;
  @Input() readonly = false;
  @Input() displayFormat = 'DD-MM-YYYY';
  @Input() placeholder: string;
  @Input() max = '';

  control: AbstractControl;

  constructor(private form: FormGroupDirective) {}

  ngOnInit() {
    this.control = this.form.control.get(this.controlName);
  }
}
