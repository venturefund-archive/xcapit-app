import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-avatar-profile',
  template: `
    <ion-buttons slot="start">
      <ion-button class="button-profile" fill="clear" appTrackClick name="Profile" (click)="this.goToProfileMenu()">
        <img src="assets/img/user-profile/avatar-profile.svg" />
      </ion-button>
    </ion-buttons>
  `,
  styleUrls: ['./avatar-profile.component.scss'],
})
export class AvatarProfileComponent implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToProfileMenu() {
    this.navController.navigateForward(['/profiles/menu']);
  }
}
