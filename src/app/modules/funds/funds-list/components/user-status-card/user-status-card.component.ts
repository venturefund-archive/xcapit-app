import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';

@Component({
  selector: 'app-user-status-card',
  template: `
    <div class="user-status" *ngIf="this.userStatus.status_name !== 'COMPLETE' && this.userStatus.status_name !== ''">
      <div class="user-status ion-padding">
        <div *ngIf="this.notOwnerFundBalances" class="type-toggle">
          <a (click)="this.hideText()">
            <ion-icon class="eye-button" [hidden]="!this.hideFundText" name="eye-off-outline"></ion-icon>
            <ion-icon class="eye-button" [hidden]="this.hideFundText" name="eye-outline"></ion-icon>
          </a>
        </div>
        <div class="ux-font-text-xl user-status__title">
          <ion-text>{{ 'funds.funds_list.user_status.title' | translate }}</ion-text>
        </div>
        <div class="user-status__img">
          <img src="assets/img/fund-list/start-invest.svg" alt="Start invest" />
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./user-status-card.component.scss'],
})
export class UserStatusCardComponent implements OnInit {
  @Input() userStatus: any;
  @Input() notOwnerFundBalances: any;

  actionButtonName: string;
  newFundUrl: string;
  hideFundText: boolean;

  constructor(private navController: NavController, private localStorageService: LocalStorageService) {}

  ngOnInit() {
  }

  async hideText() {
    this.localStorageService.toggleHideFunds();
  }
}
