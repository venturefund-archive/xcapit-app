import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-notification-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ni">
      <ion-item class="ni__body" [ngClass]="{ni__new: !this.notification.read}">
        <div class="ni__body__icon">
          
        </div>
          
        <div style="width: 100%;">
          <ion-label>
            <div class="ni__body__title">{{ this.notification.title }}</div>
            <div class="ni__body__message">{{ this.notification.message }}</div>
          </ion-label>
        </div>
        <div class="ni__body__date">
            {{ this.createdTime }}
        </div>
      </ion-item>
      <!--ion-item-options side="end">
        <ion-item-option color="danger" expandable (click)="this.remove()">
          <ion-icon slot="icon-only" name="trash"></ion-icon>
        </ion-item-option>
      </ion-item-options-->
    </div>
  `,
  styleUrls: ['./notification-item.component.scss']
})
export class NotificationItemComponent {
  @Input()
  notification: any;

  @Output()
  clickRemove = new EventEmitter<any>();

  @Output()
  clickNotification = new EventEmitter<any>();

  createdTime: any;

  ngOnInit() {
    this.createdTime = this.getCreatedTime(this.notification.created);
  }

  remove() {
    this.clickRemove.emit(this.notification.id);
  }

  notificationClicked() {
    this.clickNotification.emit(this.notification.id);
  }

  getCreatedTime(date) {
    const a = moment(date);
    const b = moment(new Date());
    
    if (b.diff(a, 'days') > 0) {
      return b.diff(a, 'days') + 'd';
    } else if (b.diff(a, 'hours') > 0) {
      return b.diff(a, 'hours') + 'h';
    } else if (b.diff(a, 'minutes') > 0){
      return b.diff(a, 'minutes') + 'm';
    } else {
      return b.diff(a, 'seconds') + 's';
    }
  }
}
