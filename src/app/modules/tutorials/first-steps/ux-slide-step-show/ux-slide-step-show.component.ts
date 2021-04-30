import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ux-slide-step-show',
  template: `
    <div class="container">
      <div
        class="container__step"
        *ngFor="let stepItem of this.totalArray"
        [ngClass]="{ active: stepItem === this.step }"
      ></div>
    </div>
  `,
  styleUrls: ['./ux-slide-step-show.component.scss'],
})
export class UxSlideStepShowComponent implements OnInit {
  totalArray = [];
  @Input() step = 0;
  @Input() set total(val) {
    this.totalArray = Array.from({ length: val }, (v, k) => k);
  }

  constructor() {}

  ngOnInit() {}
}
