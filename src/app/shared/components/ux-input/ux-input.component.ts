import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  AbstractControl
} from '@angular/forms';

@Component({
  selector: 'app-ux-input',
  template: `
    <div class="ux_input_container">
      <ion-label class="ux_input_container__label">{{ this.label }}</ion-label>
      <ion-item class="ux_input_container__item">
        <ion-input
          #passwordEyeRegister
          [formControlName]="this.controlName"
          [type]="this.type"
          [inputmode]="this.inputmode"
          [placeholder]="this.placeholder"
        ></ion-input>

        <ion-icon
          class="ux_input_container__item__error_icon"
          item-end
          [hidden]="
            !(this.control && this.control.invalid && this.control.touched)
          "
          name="ux-error"
          color="uxsecondary"
        ></ion-icon>
        <button
          [hidden]="!this.passwordType"
          item-end
          class="ux_input_container__item__eye_icon"
          (click)="this.togglePasswordMode()"
        >
          <ion-icon
            [name]="this.type === 'text' ? 'eye-off' : 'eye'"
          ></ion-icon>
        </button>
      </ion-item>
      <app-errors-form-item
        class="ux_input_container__item__errors"
        [controlName]="this.controlName"
        [errors]="this.errors"
      ></app-errors-form-item>
    </div>
  `,
  styleUrls: ['./ux-input.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UxInputComponent implements OnInit {
  @Input() label: string;
  @Input() inputmode: string;
  @Input() type: string;
  @Input() errors: any[] = [];
  @Input() controlName: string;
  @Input() placeholder: string;

  passwordType: boolean;
  @ViewChild('passwordEyeRegister', { read: ElementRef, static: true })
  passwordEye: ElementRef;

  control: AbstractControl;

  constructor(private form: FormGroupDirective) {}

  ngOnInit() {
    this.passwordType = this.type === 'password';
    this.control = this.form.control.get(this.controlName);
  }

  togglePasswordMode() {
    // cambiar tipo input
    this.type = this.type === 'text' ? 'password' : 'text';
    // obtener el input
    const nativeEl = this.passwordEye.nativeElement.querySelector('input');
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
