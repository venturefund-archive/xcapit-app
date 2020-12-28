import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header-profile',
  template: `
    <ion-header>
      <div class="hp">
        <div
          class="hp__subheader-bg"
          [ngClass]="{ editing: this.editing }"
        ></div>
        <div class="hp__avatar" [ngClass]="{ editing: this.editing }">
          <ion-avatar>
            <img src="assets/img/user-profile/avatar-default.png" alt="avatar"/>
          </ion-avatar>
        </div>
        <div class="hp__info">
          <div class="hp__info__not_editing" *ngIf="!this.editing">
            <ion-text
              class="hp__info__not_editing__name ux-font-gilroy ux-fweight-extrabold ux-fsize-16"
              color="uxdark"
            >
              {{ this.data?.first_name }} {{ this.data?.last_name }}
            </ion-text>
            <ion-text
              class="hp__info__not_editing__address ux-font-lato ux-fweight-regular ux-fsize-12"
              color="uxsemidark"
            >
              {{ this.data?.direccion }}
            </ion-text>
          </div>
        </div>
      </div>
    </ion-header>
  `,
  styleUrls: ['./header-profile.component.scss']
})
export class HeaderProfileComponent implements OnInit {
  constructor() {}
  @Input() editing = false;
  @Input() data: any;
  ngOnInit() {}
}
