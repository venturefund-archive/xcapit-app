import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-xcapit-input',
  template: `
    <div class="xcapit_input_container">
      <ion-label class="xcapit_input_container__label" color="xdark">{{ this.label }}</ion-label>
      <ion-item class="xcapit_input_container__item">
        <ion-input
          [formControlName]="this.controlName"
          [type]="this.type"
          [inputmode]="this.inputmode"
        ></ion-input>
      </ion-item>
      <app-errors-form-item
        class="xcapit_input_container__item__errors"
        [controlName]="this.controlName"
        [errors]="this.errors"
      ></app-errors-form-item>
    </div>
  `,
  styleUrls: ['./xcapit-input.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class XcapitInputComponent implements OnInit {
  @Input() label: string;
  @Input() inputmode: string;
  @Input() type: string;
  @Input() errors: any[] = [];
  @Input() controlName: string;

  constructor() {}

  ngOnInit() {}
}
