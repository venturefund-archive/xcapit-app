import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ux-list',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./ux-list.component.scss'],
})
export class UxListComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
