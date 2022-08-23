import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-circle-progress',
  template: `
    <div class="cp">
      <svg class="cp__svg">
        <circle cx="30" cy="30" r="25" class="cp__svg_circle cp__svg_circle__background"></circle>
        <circle
          cx="30"
          cy="30"
          r="25"
          class="cp__svg_circle"
          [ngStyle]="{ 'stroke-dashoffset': this.actualProgress }"
        ></circle>
      </svg>
      <span class="ux-font-header-titulo cp__text">{{ this.doneModules }}/{{ this.allModules }}</span>
    </div>
  `,
  styleUrls: ['./circle-progress.component.scss'],
})
export class CircleProgressComponent implements OnInit, OnChanges {
  @Input() doneModules: number;
  @Input() allModules: number;
  @Input() percentage: number;
  // Circle Perimeter = PI * r ^^ 2
  circlePerimeter = 157;
  actualProgress: number;
  constructor() {}

  ngOnInit() {
    this.setProgress();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setProgress(changes.percentage.currentValue);
  }

  setProgress(percentageChange?) {
    if (percentageChange) this.percentage = percentageChange;
    this.actualProgress = this.circlePerimeter * ((100 - this.percentage) / 100);
  }
}
