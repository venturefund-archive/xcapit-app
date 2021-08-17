import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon-button-card',
  template: `
    <div class="rc">
      <div class="rc__icon"><ion-icon color="uxprimary" [name]="this.icon"></ion-icon></div>
      <div class="rc__text">
        <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-10">{{ this.text }}</ion-text>
      </div>
    </div>
  `,
  styleUrls: ['./icon-button-card.component.scss'],
})
export class IconButtonCardComponent implements OnInit {
  @Input() icon: string;
  @Input() text: string;

  constructor() {}

  ngOnInit() {}
}
