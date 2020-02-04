import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ux-title',
  template: `
    <div class="ux_title">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./ux-title.component.scss']
})
export class UxTitleComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
