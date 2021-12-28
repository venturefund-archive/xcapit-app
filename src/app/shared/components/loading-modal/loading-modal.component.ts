import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-modal',
  template: `
    <div class="main">
      <div class="main__primary_text ux-font-text-xl">
        <ion-text>{{ this.title }}</ion-text>
      </div>
      <div class="main__secondary_text ux-font-text-base">
        <ion-text>{{ this.subtitle }}</ion-text>
      </div>
      <div class="main__waiting_image">
        <img [src]="this.image" />
      </div>
    </div>
  `,
  styleUrls: ['./loading-modal.component.scss'],
})
export class LoadingModalComponent implements OnInit {
  title: string;
  subtitle: string;
  image: string;
  constructor() {}

  ngOnInit() {}
}
