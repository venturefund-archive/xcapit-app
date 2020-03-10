import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiProfilesService } from '../shared-profiles/services/api-profiles/api-profiles.service';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';

@Component({
  selector: 'app-user-profile',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center" *ngIf="this.editing">{{
          'profiles.user_profile.header' | translate
        }}</ion-title>
        <ion-buttons slot="end">
          <ion-button
            class="ux-font-lato ux-fweight-semibold ux-fsize-14 ion-padding-end"
            appTrackClick
            name="Edit Save Profile"
            (click)="this.toggleEditProfile()"
            [dataToTrack]="{ description: 'editing: ' + this.editing }"
          >
            {{
              this.editing
                ? ('profiles.user_profile.save_button' | translate)
                : ('profiles.user_profile.edit_button' | translate)
            }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding-bottom">
      <div class="up__header">
        <app-header-profile
          [editing]="this.editing"
          [data]="this.data"
        ></app-header-profile>
      </div>
      <div class="up__show_profile" *ngIf="!this.editing">
        <app-show-profile [data]="this.data"></app-show-profile>
      </div>
      <div class="up__edit_profile" *ngIf="this.editing">
        <app-edit-profile [data]="this.data" #editProfile></app-edit-profile>
      </div>
    </ion-content>
  `,
  styleUrls: ['./user-profile.page.scss']
})
export class UserProfilePage implements OnInit {
  editing = true;
  data: any;
  @ViewChild('editProfile', { static: false })
  editProfile: EditProfileComponent;

  constructor(private apiProfiles: ApiProfilesService) {}

  ngOnInit() {}

  getData() {
    this.apiProfiles.crud.get().subscribe(res => (this.data = res));
  }

  toggleEditProfile() {
    if (this.editing) {
      this.editProfile.save();
    }
    this.editing = !this.editing;
  }

  ionViewWillEnter() {
    this.getData();
  }
}
