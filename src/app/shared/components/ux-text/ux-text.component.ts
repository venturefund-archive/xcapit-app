import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ux-text',
  template: `
    <div class="ux-font-text-base ux_text">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./ux-text.component.scss'],
})
export class UxTextComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
