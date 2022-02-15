import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiUsuariosService } from 'src/app/modules/usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';

@Component({
  selector: 'app-choose-investor-profile-card',
  template: `
    <ion-card class="cipc">
      <div class="cipc__title">
        <ion-text name="Title" class="ux-font-header-titulo">
          {{ this.titleText | translate }}
        </ion-text>
      </div>
      <div class="cipc__text">
        <ion-text name="Description" class="ux-font-text-xs">
          {{ this.descriptionText | translate }}
        </ion-text>
      </div>
      <div class="cipc__button_primary button-container">
        <ion-button appTrackClick name="Primary Button" class="ux_button ion-no-padding" size="small" color="uxsecondary" (click)="this.primaryAction()">
          {{ this.buttonPrimaryText | translate }}
        </ion-button>
      </div>
      <div class="cipc__button_secondary button-container">
        <ion-button appTrackClick name="Secondary Button" class="ux_button ion-no-padding" size="small" fill="clear" color="info" (click)="this.secondaryAction()">
          {{ this.buttonSecondaryText | translate }}
        </ion-button>
      </div>
    </ion-card>
  `,
  styleUrls: ['./choose-investor-profile-card.component.scss'],
})
export class ChooseInvestorProfileCardComponent implements OnInit {
  @Input() hasDoneInvestorTest: boolean;
  private get translationBaseRoute(): string {
    const base = 'defi_investments.defi_investment_products.choose_investor_profile';
    
    if (this.hasDoneInvestorTest) {
      return `${base}.complete_test`;
    }

    return `${base}.incomplete_test`;
  }

  get titleText(): string {
    return `${this.translationBaseRoute}.title`;
  } 

  get descriptionText(): string {
    return `${this.translationBaseRoute}.description`;
  }

  get buttonPrimaryText(): string {
    return `${this.translationBaseRoute}.button_primary`;
  }

  get buttonSecondaryText(): string {
    return `${this.translationBaseRoute}.button_secondary`;
  }

  constructor(
    private navController: NavController
  ) {}

  ngOnInit() {}

  primaryAction() {
    if (this.hasDoneInvestorTest) {
      this.goToSelectInvestorProfile();
    } else {
      this.goToInvestorTest();
    }
  }

  secondaryAction() {
    if (this.hasDoneInvestorTest) {
      this.goToInvestorTest();
    } else {
      this.goToSelectInvestorProfile();
    }
  }

  private goToInvestorTest() {
    this.navController.navigateForward(['/wealth-management/investor-test']);
  }

  private goToSelectInvestorProfile() {
    this.navController.navigateForward(['/wealth-management/about-investor-profiles']);
  }
}
