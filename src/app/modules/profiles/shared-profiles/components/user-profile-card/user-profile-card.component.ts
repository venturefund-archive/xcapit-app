import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-user-profile-card',
  template: `
    <div class="user-profile-card ux-card ion-padding">
      <div class="user-data">
        <div class="user-img">
          <img src="assets/img/user-profile/avatar-user.svg" />
        </div>
        <div class="user-mail">
          <ion-text class="ux-font-header-titulo">{{ this.profile.email }}</ion-text>
        </div>
      </div>
      <div class="footer">
        <ion-button
          *ngIf="false"
          appTrackClick
          class="option-button ux_button ion-no-padding ion-no-margin"
          fill="clear"
          name="Investor Profile"
          (click)="this.goToInvestorTestStart()">
          <ion-text>{{ 'profiles.user_profile_menu.profile_footer.investor_profile_button' | translate }}</ion-text>
          <ion-icon name="chevron-forward"></ion-icon>
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./user-profile-card.component.scss'],
})
export class UserProfileCardComponent implements OnInit {
  @Input() profile: any;

  get hasDoneInvestorTest(): boolean {
    return this.profile.investor_category !== 'wealth_managements.profiles.no_category';
  }
  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToInvestorTestStart() {
    this.navController.navigateForward(['/wealth-management/investor-test-options']);
  }
}
