import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ux-header-login',
  template: `
    <div class="ux_header_login">
      <div class="ux_header_login__content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./ux-header-login.component.scss']
})
export class UxHeaderLoginComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
}
