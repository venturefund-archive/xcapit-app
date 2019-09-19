import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-percentage-display',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <ion-icon
        *ngIf="this.percentage > 0"
        name="arrow-round-up"
      ></ion-icon>
      <ion-icon
        *ngIf="this.percentage < 0"
        name="arrow-round-down"
      ></ion-icon>
      <ion-icon
        *ngIf="this.percentage === 0"
        name="pause"
        style="transform: rotate(90deg)"
      ></ion-icon>
      {{ this.percentage | number: '1.2-2' }}%
    </div>
  `,
  styleUrls: ['./percentage-display.component.scss']
})
export class PercentageDisplayComponent {
  @Input()
  percentage: number;

  constructor() {}
}
