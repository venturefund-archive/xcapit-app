import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { News } from '../../interfaces/news.interface';

@Component({
  selector: 'app-news-item',
  template: `
    <div class="ni">
      <ion-item class="ni__item ux-card" detail="true" (click)="this.emitClicked()" lines="none">
        <ion-badge class="ni__item__badge ux-badge" color="warning-light">{{ this.item.badge }}</ion-badge>
        <div class="ni__item__text">
          <ion-text class="ni__item__text__title ux-font-header-titulo">{{ this.item.title }}</ion-text>
          <ion-text class="ni__item__text__description ux-font-text-xxs">{{ this.item.description }}</ion-text>
        </div>
      </ion-item>
    </div>
  `,
  styleUrls: ['./news-item.component.scss'],
})
export class NewsItemComponent implements OnInit {
  @Input() item: News;
  @Output() clicked: EventEmitter<string> = new EventEmitter<string>();
  constructor() {}

  ngOnInit() {}

  emitClicked() {
    this.clicked.emit(this.item.url);
  }
}
