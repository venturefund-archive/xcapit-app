import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-ux-input-underlined',
  template: `
    <div class="iu">
      <ion-item class="iu__item">
        <ion-input
          [formControlName]="this.controlName"
          [type]="this.type"
          [inputmode]="this.inputmode"
          [placeholder]="this.placeholder"
          [maxlength]="this.maxlength"
          [readonly]="this.readonly"
          [debounce]="this.debounce"
        ></ion-input>
        <div id="loading" *ngIf="this.loading">
          <app-ux-loading-block></app-ux-loading-block>
        </div>
      </ion-item>
      <div class="iu__labels">
        <ion-label class="ux-font-text-xxs" color="uxsemidark">{{ this.labelLeft }}</ion-label>
        <ion-label class="ux-font-text-xxs" color="uxsemidark">{{ this.labelRight }}</ion-label>
      </div>
    </div>
  `,
  styleUrls: ['./ux-input-underlined.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class UxInputUnderlinedComponent implements OnInit {
  @Input() labelLeft: string;
  @Input() labelRight: string;
  @Input() controlName: string;
  @Input() type: string;
  @Input() inputmode: string;
  @Input() placeholder: string;
  @Input() maxlength: number;
  @Input() readonly: boolean;
  @Input() debounce = 0;
  @Input() loading = false;

  constructor() {}

  ngOnInit() {}
}
