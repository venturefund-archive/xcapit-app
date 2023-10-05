import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-profile-card',
  template: `
    <div class="user-profile-card ux-card ion-padding">
      <div class="user-data">
        <div class="user-img">
          <img src="assets/img/user-profile/user-profile-avatar.svg" />
        </div>
        <div class="user-mail">
          <ion-text class="ux-font-header-titulo">{{ this.username }}</ion-text>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./user-profile-card.component.scss'],
})
export class UserProfileCardComponent {
  @Input() profile: any;
  @Input() username: string;

  constructor() {}


}
