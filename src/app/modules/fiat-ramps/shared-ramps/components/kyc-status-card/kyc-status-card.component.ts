import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { KriptonStorageService } from '../../services/kripton-storage/kripton-storage.service';
import { RegistrationStatus } from '../../../enums/registration-status.enum';

@Component({
  selector: 'app-kyc-status-card',
  template: ` <div
    class="ksc ux-card ion-padding"
    [ngClass]="this.style"
    *ngIf="!this.disabledCard"
    (click)="this.redirectToPage()"
  >
    <div class="ksc__title">
      <ion-text class="ux-font-text-lg title">
        {{ this.title }}
      </ion-text>
      <ion-text class="ux-font-text-xxs status" *ngIf="this.statusText && !this.kycApproved">
        {{ this.statusText }}
      </ion-text>
      <ion-icon
        class="main__close_button__icon"
        name="ux-close"
        (click)="this.close()"
        *ngIf="this.kycApproved"
      ></ion-icon>
    </div>
    <div class="ksc__message">
      <ion-text class="ux-font-text-xxs">
        {{ this.message }}
      </ion-text>
    </div>
  </div>`,
  styleUrls: ['./kyc-status-card.component.scss'],
})
export class KYCStatusCardComponent implements OnInit {
  @Input() title: string;
  @Input() statusText: string;
  @Input() userStatus: string;
  @Input() kycApproved: boolean;
  @Input() message: string;
  @Input() style: string;
  @Input() disabledCard: boolean;

  constructor(private navController: NavController, private kriptonStorage: KriptonStorageService) {}

  ngOnInit() {}

  close() {
    this.disabledCard = true;
    this.kriptonStorage.set('kyc_approved', this.kycApproved);
  }

  redirectToPage() {
    if (this.userStatus !== 'COMPLETE') {
      console.log("status",this.userStatus)
      const redirection = RegistrationStatus[this.userStatus];
      this.navController.navigateForward(redirection);
    }
  }
}
