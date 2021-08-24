import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon-button-card',
  template: `
    <div class="rc" style="position:relative;">
      <div class="rc__icon"><ion-icon color="uxprimary" [name]="this.icon"></ion-icon></div>
      <div class="rc__text">
        <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-10">{{ this.text }}</ion-text>
      </div>
      <div *ngIf="this.comingSoon" class="coming_soon">
        <ion-text class="ux-font-lato ux-fweight-bold ux-fsize-8">{{
          'shared.app_icon_button_card.coming_soon' | translate
        }}</ion-text>
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
