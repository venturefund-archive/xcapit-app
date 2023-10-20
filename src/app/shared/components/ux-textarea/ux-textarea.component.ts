import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-ux-textarea',
  template: `
    <div class="ux_textarea_container">
      <ion-label class="ux-font-titulo-xs" color="primary">{{ this.label }}</ion-label>
      <ion-item class="ux_textarea_container__item">
        <ion-textarea
          #inputRegister
          [rows]="this.rows"
          [formControlName]="this.controlName"
          [inputmode]="this.inputmode"
          [placeholder]="this.placeholder"
        ></ion-textarea>

        <ion-icon
          *ngIf="!this.useNewErrors"
          class="ux_textarea_container__item__error_icon"
          item-end
          [hidden]="!(this.control && this.control.invalid && this.control.touched)"
          name="ux-error"
          color="uxdanger"
        ></ion-icon>
      </ion-item>
      <app-errors-form-item
        *ngIf="!this.useNewErrors"
        [controlName]="this.controlName"
        [errors]="this.errors"
      ></app-errors-form-item>
      <app-errors-form-password-item
        *ngIf="this.useNewErrors"
        [control]="this.control"
        [errors]="this.errors"
      ></app-errors-form-password-item>
    </div>
  `,
  styleUrls: ['./ux-textarea.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class UxTextareaComponent implements OnInit {
  @Input() label: string;
  @Input() inputmode: string;
  @Input() rows = 10;
  @Input() errors: any[] = [];
  @Input() controlName: string;
  @Input() placeholder: string;
  @Input() useNewErrors = false;
  control: AbstractControl;

  constructor(private form: FormGroupDirective) {}

  ngOnInit() {
    this.control = this.form.control.get(this.controlName);
  }
}
