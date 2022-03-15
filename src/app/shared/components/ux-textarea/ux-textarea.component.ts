import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-ux-textarea',
  template: `
    <div class="ux_textarea_container">
      <ion-label class="ux-font-text-xs">{{ this.label }}</ion-label>
      <ion-item class="ux_textarea_container__item">
        <ion-textarea
          #inputRegister
          [rows]="this.rows"
          [formControlName]="this.controlName"
          [inputmode]="this.inputmode"
          [placeholder]="this.placeholder"
        ></ion-textarea>

        <ion-icon
          class="ux_textarea_container__item__error_icon"
          item-end
          [hidden]="!(this.control && this.control.invalid && this.control.touched)"
          name="ux-error"
          color="secondary"
        ></ion-icon>
      </ion-item>
      <app-errors-form-item [controlName]="this.controlName" [errors]="this.errors"></app-errors-form-item>
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
  control: AbstractControl;

  constructor(private form: FormGroupDirective) {}

  ngOnInit() {
    this.control = this.form.control.get(this.controlName);
  }
}
