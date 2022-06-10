import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
export class CircleProgressComponent implements OnInit {
  @Input() doneModules: number;
  @Input() allModules: number;
  @Output() percentage = new EventEmitter<number>();
  actualProgress: number;
  constructor() {}

  ngOnInit() {
    this.setProgress();
  }

  setProgress() {
    this.actualProgress = 157 - 157 * this.calculateProgressPercentage();
  }

  calculateProgressPercentage() {
    const percentage = this.doneModules / this.allModules;
    this.percentage.emit(percentage);
    return percentage;
  }
}
