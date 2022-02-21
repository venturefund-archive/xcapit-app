import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-informative-card',
  template: `
    <div class="ic ux-card ion-padding">
      <div>
        <ion-text class="ux-font-text-lg ic__title">{{ this.title | translate}}</ion-text>
      </div>
      <div>
        <ion-text class="ux-font-text-xs ic__description" color="uxsemidark">{{ this.description | translate }}</ion-text>
      </div>
    </div>
  `,
  styleUrls: ['./informative-card.component.scss'],
})
export class InformativeCardComponent implements OnInit {
  @Input() title: string;
  @Input() description: string;

  constructor() {}

  ngOnInit() {}
}
