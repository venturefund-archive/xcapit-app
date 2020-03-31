import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ux-loading-block',
  template: `
    <div class="lb" [ngClass]="{ backdrop: this.backdrop }">
      <div
        class="spinner"
        [style.min-width]="this.minSize"
        [style.min-height]="this.minSize"
      ></div>
    </div>
  `,
  styleUrls: ['./ux-loading-block.component.scss']
})
export class UxLoadingBlockComponent implements OnInit {
  @Input() backdrop = false;
  @Input() minSize = '20px';
  @Input() color = '';
  constructor() {}

  ngOnInit() {}
}
