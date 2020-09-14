import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ux-list-inverted',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./ux-list-inverted.component.scss'],
})
export class UxListInvertedComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
