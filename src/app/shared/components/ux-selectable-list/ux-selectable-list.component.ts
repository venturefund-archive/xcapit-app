import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ux-selectable-list',
  template: `
    <div class="sl">
      <ng-content></ng-content>
      <div class="list-divider"></div>
    </div>
  `,
  styleUrls: ['./ux-selectable-list.component.scss']
})
export class UxSelectableListComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
