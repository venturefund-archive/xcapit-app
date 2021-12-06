import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-notification-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ni">
      <ion-item class="ni__body">
        <div class="ni__body__container-icon">
          <img *ngIf="this.notification.type === 'TP'" src="assets/img/notifications/Trading up.svg" />
          <img *ngIf="this.notification.type === 'SL'" src="assets/img/notifications/Trading down.svg" />
          <img *ngIf="this.notification.type === 'reward'" src="assets/img/notifications/reward-icon.svg" />
        </div>
        <div style="width: 100%;">
          <ion-label>
            <div class="ni__body__title ux-font-header-titulo">{{ this.notification.title }}</div>
            <div class="ni__body__message ux-font-text-xs">{{ this.notification.message }}</div>
          </ion-label>
        </div>
        <div class="ni__body__date ux-font-text-xs">
          {{ this.createdTime }}
        </div>
      </ion-item>
      <hr />
    </div>
  `,
  styleUrls: ['./notification-item.component.scss'],
})
export class NotificationItemComponent implements OnInit {
  @Input() notification: any;

  createdTime: any;

  ngOnInit() {
    this.createdTime = this.getCreatedTime(this.notification.created);
  }

  getCreatedTime(date) {
    const initialDate = moment(date);
    const actualDate = moment(new Date());

    if (actualDate.diff(initialDate, 'days') > 0) {
      return actualDate.diff(initialDate, 'days') + ' d';
    } else if (actualDate.diff(initialDate, 'hours') > 0) {
      return actualDate.diff(initialDate, 'hours') + ' h';
    } else if (actualDate.diff(initialDate, 'minutes') > 0) {
      return actualDate.diff(initialDate, 'minutes') + ' m';
    } else {
      return actualDate.diff(initialDate, 'seconds') + ' s';
    }
  }
}
