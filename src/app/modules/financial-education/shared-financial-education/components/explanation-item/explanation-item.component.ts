import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-explanation-item',
  template: `
    <div class="ei">
      <div class="ei__title">
        <ion-text class="ux-font-text-xl number">
          {{ item.number | translate }}
        </ion-text>
        <ion-text class="ux-font-header-titulo title">
          {{ item.title | translate }}
        </ion-text>
      </div>
      <div class="ei__item">
        <img [src]="item.icon" />
        <ion-text class="ux-font-text-base">
          {{ item.description | translate }}
        </ion-text>
      </div>
    </div>
  `,

  styleUrls: ['./explanation-item.component.scss'],
})
export class ExplanationItemComponent implements OnInit {
  @Input() item;
  constructor() {}

  ngOnInit() {}
}
