import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-ux-textarea',
  template: `
    <div class="ux_textarea_container">
      <ion-label class="ux_textarea_container__label">{{ this.label }}</ion-label>
      <ion-item class="ux_textarea_container__item">
        <ion-textarea
          #inputRegister
          [rows]="10"
          [formControlName]="this.controlName"
          [inputmode]="this.inputmode"
          [placeholder]="this.placeholder"
        ></ion-textarea>

        <ion-icon
          class="ux_textarea_container__item__error_icon"
          item-end
          [hidden]="
            !(this.control && this.control.invalid && this.control.touched)
          "
          name="ux-error"
          color="uxsecondary"
        ></ion-icon>
      </ion-item>
      <app-errors-form-item
        class="ux_textarea_container__item__errors"
        [controlName]="this.controlName"
        [errors]="this.errors"
      ></app-errors-form-item>
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
  @Input() errors: any[] = [];
  @Input() controlName: string;
  @Input() placeholder: string;
  passwordType: boolean;
  @ViewChild('inputRegister', { read: ElementRef, static: true })
  input: ElementRef;

  control: AbstractControl;

  constructor(private form: FormGroupDirective) {}

  ngOnInit() {
    this.control = this.form.control.get(this.controlName);
  }

  togglePasswordMode() {
    // obtener el input
    const nativeEl = this.input.nativeElement.querySelector('input');
    // obtener el indice de la posición del texto actual en el input
    const inputSelection = nativeEl.selectionStart;
    // ejecuto el focus al input
    nativeEl.focus();
    // espero un milisegundo y actualizo la posición del indice del texto
    setTimeout(() => {
      nativeEl.setSelectionRange(inputSelection, inputSelection);
    }, 1);
  }
}
