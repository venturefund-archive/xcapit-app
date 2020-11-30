import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ux-date-range',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./ux-date-range.component.scss'],
})
export class UxDateRangeComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
