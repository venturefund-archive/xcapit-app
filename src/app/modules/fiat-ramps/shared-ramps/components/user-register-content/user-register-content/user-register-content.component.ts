import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-register-content',
  template: `
    <div>
      <div class="urc__title">
        <ion-text class="ux-font-text-lg">{{ this.title | translate }}</ion-text>
      </div>
      <div class="urc__subtitle">
        <ion-text class="ux-font-text-base">{{ this.subtitle | translate }}</ion-text>
      </div>
      <div *ngIf="this.status === 'COMPLETE'" class="urc__subtitle">
        <ion-text class="ux-font-text-base">{{ this.subtitle2 | translate }}</ion-text>
      </div>
    </div>
  `,
  styleUrls: ['./user-register-content.component.scss'],
})
export class UserRegisterContentComponent implements OnInit {
  @Input() status: string;
  title: string;
  subtitle: string;
  subtitle2: string;

  constructor() {}

  ngOnInit() {
    this.setText();
  }

  setText() {
    this.title = `fiat_ramps.shared.user_register_content.${this.status.toLowerCase()}.title`;
    this.subtitle = `fiat_ramps.shared.user_register_content.${this.status.toLowerCase()}.subtitle`;
    this.subtitle2 = `fiat_ramps.shared.user_register_content.${this.status.toLowerCase()}.subtitle_2`;
  }
}
