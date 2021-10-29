import { Component, OnInit, Input } from '@angular/core';
import { UX_ALERT_TYPES } from './ux-alert-types';

@Component({
  selector: 'app-ux-alert-message',
  template: `
    <div class="am ux-font-text-xs" [ngClass]="this.type.cssClass">
      <div class="am__icon">
        <ion-icon [name]="this.type.uxIcon"></ion-icon>
      </div>
      <div class="am__message">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./ux-alert-message.component.scss'],
})
export class UxAlertMessageComponent implements OnInit {
  constructor() {}
  iconName: string;
  @Input() type = UX_ALERT_TYPES.info;

  ngOnInit() {}
}
