import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cause',
  template: `
    <div class="cc">
      <div class="cc__image">
        <img [src]="this.cause.image" alt="Cause Image" />
      </div>
      <div class="cc__logo">
        <img [src]="this.cause.logo" alt="Cause logo" />
      </div>
      <div class="cc__text-badge">
        <ion-text class="ux-font-header-titulo">{{ this.cause.title | translate }}</ion-text>
        <ion-badge class="ux-font-num-subtitulo ux-badge cc__text-badge__badge" slot="end">{{ this.badge | translate }}</ion-badge>
      </div>
    </div>
  `,
  styleUrls: ['./cause.component.scss'],
})
export class CauseComponent implements OnInit {
  @Input() cause;
  badge: string;
  constructor() {}

  ngOnInit() {
    this.setType();
  }

  setType() {
    this.badge = `donations.causes.types.${this.cause.type}`;
  }
}
