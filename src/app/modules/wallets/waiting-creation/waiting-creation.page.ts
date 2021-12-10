import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-waiting-creation',
  template: ` <ion-content>
    <div class="main">
      <div class="main__primary_text ux-font-text-xl">
        <ion-text>{{ 'wallets.waiting_creation.title' | translate }}</ion-text>
      </div>
      <div class="main__secondary_text ux-font-text-base">
        <ion-text>{{ 'wallets.waiting_creation.subtitle' | translate }}</ion-text>
      </div>
      <div class="main__waiting_image">
        <img src="../../../../assets/img/waiting.svg" />
      </div>
    </div>
  </ion-content>`,
  styleUrls: ['./waiting-creation.page.scss'],
})
export class WaitingCreationPage implements OnInit {
  imagePath = 'waiting.svg';
  constructor() {}

  ngOnInit() {}
}
