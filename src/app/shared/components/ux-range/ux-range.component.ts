import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-ux-range',
  template: `
    <div class="ux_range">
      <ion-label class="ux_range__label">{{ this.label }}</ion-label>
      <div class="ux_range__content">
        <div class="ux_range__content__display-on-release">
          <ion-text class="ux-font-text-lg">
            {{ this.control?.value }}
          </ion-text>
          <ion-text *ngIf="this.control" class="text ux-font-text-lg">{{ this.minText }}</ion-text>
        </div>
        <ng-content></ng-content>
        <div class="ux_range__content__max_min">
          <div class="min">{{ this.min }} {{ this.minText }}</div>
          <div class="max">{{ this.max }} {{ this.maxText }}</div>
        </div>
      </div>
    </div>
  `,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
  styleUrls: ['./ux-range.component.scss'],
})
export class UxRangeComponent implements OnInit {
  @Input() label = '';
  @Input() min: string | number;
  @Input() max: string | number;
  @Input() minText = '';
  @Input() maxText = '';
  @Input() controlName: string;
  control: AbstractControl;
  constructor(private form: FormGroupDirective) {}

  ngOnInit() {
    this.control = this.form.control.get(this.controlName);
  }
}
