import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ux-list-card',
  template: `
    <div class="lc">
      <ion-list class="lc__list">
        <div *ngFor="let item of this.data; let last = last">
          <ion-item
            class="lc__list__item"
            lines="none"
            [attr.button]="this.selectable"
            (click)="this.emitItemClicked(item)"
            appTrackClick
            name="Item Clicked"
            [dataToTrack]="{ description: this.labelName ? item[this.labelName] : item }"
          >
            <img class="lc__list__img" *ngIf="this.iconName" [src]="item[this.iconName]" alt="icon" />
            <ion-label class="lc__list__label"> {{ this.labelName ? item[this.labelName] : item }} </ion-label>
          </ion-item>
          <div *ngIf="!last" class="list-divider"></div>
        </div>
      </ion-list>
    </div>
  `,
  styleUrls: ['./ux-list-card.component.scss'],
})
export class UxListCardComponent implements OnInit {
  @Input() data: any[];
  @Input() iconName = '';
  @Input() labelName = '';
  @Input() selectable = true;
  @Output() itemClicked: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  emitItemClicked(item) {
    if (this.selectable) {
      this.itemClicked.emit(item);
    }
  }
}
