import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiProfilesService } from '../shared-profiles/services/api-profiles/api-profiles.service';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { Router } from '@angular/router';
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';
import { UserStatus } from '../../usuarios/shared-usuarios/enums/user-status.enum';
import { LoadingService } from '../../../shared/services/loading/loading.service';
@Component({
  selector: 'app-user-profile',
  template: `
      <ion-header>
          <ion-toolbar mode="ios" color="uxprimary" class="ux_toolbar">
              <ion-buttons slot="start">
                  <ion-back-button
                          *ngIf="!(this.userStatus?.status_name === this.userStatusEnum.FROM_BOT) || !this.editing"
                          defaultHref="/tabs/funds">
                  </ion-back-button>
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
  editing = false;
  userStatus: any;
  userStatusEnum = UserStatus;
  data: any;
  @ViewChild('editProfile')
  editProfile: EditProfileComponent;

  constructor(
    private apiProfiles: ApiProfilesService,
    private apiUsuarios: ApiUsuariosService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {}

  getData() {
    this.apiProfiles.crud.get().subscribe(res => {
      this.data = res;
    });
  }

  toggleEditProfile() {
    if (this.editing) {
      this.editProfile.save().subscribe(
        res => {
          const fromBot = this.userStatus.status_name === this.userStatusEnum.FROM_BOT;
          if (res && fromBot) {
            this.router.navigate(['tabs/funds']);
          } else if (res && !fromBot) {
            this.getData();
            this.editing = !this.editing;
          }
        });
    } else {
      this.editing = true;
    }
  }

  ionViewWillEnter() {
    this.loadingService.enabled();
    this.apiUsuarios.status(false).subscribe((res: any) => {
      this.userStatus = res;
      this.editing = (this.userStatus.status_name === this.userStatusEnum.FROM_BOT);
      this.loadingService.disabled();
      this.data.viewBillData = !(this.userStatus.status_name === this.userStatusEnum.FROM_BOT);
    });
    this.getData();
  }
}
