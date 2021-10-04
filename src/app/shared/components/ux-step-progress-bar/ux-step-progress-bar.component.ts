import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ux-step-progress-bar',
  template: `
    <div class="progress_bar">
      <div class="progress_bar__progress" [ngStyle]="{ width: this.progress }"></div>
    </div>
  `,
  styleUrls: ['./ux-step-progress-bar.component.scss'],
})
export class UxStepProgressBarComponent implements OnInit {
  @Input() progress = '0%';
  constructor() {}

  ngOnInit() {}
}
