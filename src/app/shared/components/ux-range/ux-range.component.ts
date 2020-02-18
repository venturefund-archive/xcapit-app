import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'app-ux-range',
  template: `
    <div class="ux_range">
      <ion-label class="ux_range__label">{{ this.label }}</ion-label>
      <div class="ux_range__content">
        <ng-content></ng-content>
        <div class="ux_range__content__max_min">
          <div class="min">{{ this.min }} {{ this.minText }}</div>
          <div class="max">{{ this.max }} {{ this.maxText }}</div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./ux-range.component.scss']
})
export class UxRangeComponent implements OnInit {
  @Input() label: string;
  @Input() min: string | number;
  @Input() max: string | number;
  @Input() minText = '';
  @Input() maxText = '';
  constructor() {}

  ngOnInit() {}
}
