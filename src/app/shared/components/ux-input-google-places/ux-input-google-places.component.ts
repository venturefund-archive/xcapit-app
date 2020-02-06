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
import { GooglePlacesDirective } from '../../directives/google-places.directive';

@Component({
  selector: 'app-ux-input-google-places',
  template: `
    <div class="ux_input_container">
      <ion-label class="ux_input_container__label">{{ this.label }}</ion-label>
      <ion-item class="ux_input_container__item">
        <ion-input
          #inputRegister
          ngClass="google-place-input"
          [formControlName]="this.controlName"
          type="text"
          [placeholder]="this.placeholder"
          appGooglePlaces
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
      </ion-item>
      <app-errors-form-item
        class="ux_input_container__item__errors"
        [controlName]="this.controlName"
        [errors]="this.errors"
      ></app-errors-form-item>
    </div>
  `,
  styleUrls: ['./ux-input-google-places.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    },
    GooglePlacesDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UxInputGooglePlacesComponent implements OnInit {
  @Input() label: string;
  @Input() errors: any[] = [];
  @Input() controlName: string;
  @Input() placeholder: string;

  @ViewChild('inputRegister', { read: ElementRef, static: true })
  input: ElementRef;

  control: AbstractControl;

  constructor(private form: FormGroupDirective) {}

  ngOnInit() {
    this.control = this.form.control.get(this.controlName);
  }
}
