import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

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
      <div class="footer">
        <ion-button
          *ngIf="this.hasDoneInvestorTest"
          appTrackClick
          class="option-button ux_button ion-no-padding ion-no-margin"
          fill="clear"
          color="info"
          name="ux_go_to_investor_profile"
          (click)="this.goToInvestments()"
        >
          <ion-text>{{ 'profiles.user_profile_menu.profile_footer.investor_profile_button' | translate }}</ion-text>
          <ion-icon color="info" name="chevron-forward"></ion-icon>
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./user-profile-card.component.scss'],
})
export class UserProfileCardComponent implements OnInit {
  @Input() profile: any;
  @Input() username: string;

  get hasDoneInvestorTest(): boolean {
    return this.profile.investor_category !== 'wealth_managements.profiles.no_category';
  }
  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToInvestments() {
    this.navController.navigateForward(['/tabs/investments']);
  }
}
