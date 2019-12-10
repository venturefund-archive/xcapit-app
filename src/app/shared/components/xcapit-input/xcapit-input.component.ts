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
      <ion-label>{{ this.label }}</ion-label>
      <ion-item>
        <ion-input
          [formControlName]="this.controlName"
          [type]="this.type"
          [inputmode]="this.inputmode"
        ></ion-input>
      </ion-item>
      <app-errors-form-item
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
