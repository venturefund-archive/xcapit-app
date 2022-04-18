import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon-button-card',
  template: `
    <div class="rc">
      <div class="rc__content" style="position:relative;">
        <div class="rc__content__icon"><ion-icon color="primary" [name]="this.icon" ariaLabel=""></ion-icon></div>
        <div *ngIf="this.comingSoon" class="rc__content__coming_soon">
          <ion-text class="ux-font-lato ux-fweight-bold ux-fsize-8">{{
            'shared.app_icon_button_card.coming_soon' | translate
          }}</ion-text>
        </div>
      </div>
      <div class="rc__content__text">
        <ion-text class="ux-font-num-subtitulo">{{ this.text }}</ion-text>
      </div>
    </div>
  `,
  styleUrls: ['./icon-button-card.component.scss'],
})
export class IconButtonCardComponent implements OnInit {
  @Input() icon: string;
  @Input() text: string;
  @Input() comingSoon = false;

  constructor() {}

  ngOnInit() {}
}
