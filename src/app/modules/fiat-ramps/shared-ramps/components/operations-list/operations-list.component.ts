import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { TwoButtonsAlertComponent } from 'src/app/shared/components/two-buttons-alert/two-buttons-alert.component';
import { FiatRampOperation } from '../../interfaces/fiat-ramp-operation.interface';
import { KriptonStorageService } from '../../services/kripton-storage/kripton-storage.service';
import { InfoProviderKriptonComponent } from '../info-provider-kripton/info-provider-kripton.component';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

@Component({
  selector: 'app-operations-list',
  template: `
    <ion-card class="ux-card ion-no-margin">
      <ion-card-header [ngClass]="this.cssWithLine">
        <div>
          <ion-card-title class="card-title ux-font-text-lg"
            >{{ this.title | translate }}
            <ion-icon name="information-circle" color="info" (click)="this.showProviderInfo()"></ion-icon>
          </ion-card-title>
          <div class="provider ux-font-text-xxs" *ngIf="this.isUserWarranty">
            {{ 'fiat_ramps.operations_list.kripton_provider' | translate }}
          </div>
          <ion-text class="ux-font-text-xs" *ngIf="this.isLogged">{{ this.loggedEmail | hideEmail }}</ion-text>
        </div>
        <div class="logout-icon" *ngIf="this.isLogged" (click)="this.showLogoutAlert()">
          <ion-icon name="ux-sign-out-info" color="info"></ion-icon>
        </div>
      </ion-card-header>
      <ion-card-content [class.operations__content]="this.hasOperations">
        <div *ngIf="!this.isLogged; then notLogged; else logged"></div>
        <ng-template #logged>
          <div *ngIf="this.hasOperations; then operationsTable; else noOperationsMessage"></div>
        </ng-template>

        <ng-template #notLogged>
          <div class="card-content">
            <ion-text name="Not Logged" class="no-operations-text ux-font-text-base">
              {{ 'fiat_ramps.operations_list.not_logged' | translate }}
            </ion-text>
            <ion-text class="link link ux-link-xl" (click)="this.navigateToVerifier()">
              {{ 'fiat_ramps.operations_list.link' | translate }}
            </ion-text>
          </div>
        </ng-template>

        <ng-template #noOperationsMessage>
          <div class="card-content">
            <ion-text name="No Operations" class="no-operations-text ux-font-text-base">
              {{ 'fiat_ramps.operations_list.no_operations_message' | translate }}
            </ion-text>
          </div>
        </ng-template>

        <ng-template #operationsTable>
          <app-operations-list-accordion
            [firstOperations]="this.firstOperations"
            [remainingOperations]="this.remainingOperations"
          ></app-operations-list-accordion>
        </ng-template>
      </ion-card-content>
    </ion-card>
  `,
  styleUrls: ['./operations-list.component.scss'],
})
export class OperationsListComponent implements OnInit, OnChanges {
  @Input() operationsList: FiatRampOperation[];
  @Input() isLogged: boolean;
  @Input() isUserWarranty: boolean;
  @Output() loggedOut: EventEmitter<void> = new EventEmitter<void>();
  private readonly numberOfOperationsToShow = 3;
  firstOperations: FiatRampOperation[];
  remainingOperations: FiatRampOperation[];
  cssWithLine: string;
  hasOperations: boolean;
  isInfoModalOpen = false;
  loggedEmail: string;
  title: string;

  constructor(
    private modalController: ModalController,
    private navController: NavController,
    private kriptonStorageService: KriptonStorageService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.setTitle();
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.setEmail();
    this.operationsList = changes.operationsList?.currentValue;
    this.hasOperations = this.checkIfUserHasOperations();
    if (this.hasOperations) this.sliceOperations();
    this.cssWithLine = this.calculateDynamicCssClasses();
  }

  navigateToVerifier() {
    this.navController.navigateForward('/fiat-ramps/user-email');
  }

  setTitle() {
    this.title = this.isUserWarranty
      ? 'fiat_ramps.operations_list.simplified_title'
      : 'fiat_ramps.operations_list.title';
  }

  sliceOperations() {
    this.operationsList = this.operationsList.slice().reverse();
    this.firstOperations = this.calculateFirstOperations();
    this.remainingOperations = this.calculateRemainingOperations();
  }

  private calculateFirstOperations(): FiatRampOperation[] {
    return this.operationsList.slice(0, this.numberOfOperationsToShow);
  }

  private calculateRemainingOperations(): FiatRampOperation[] {
    return this.operationsList.slice(this.numberOfOperationsToShow, this.operationsList.length);
  }

  private calculateDynamicCssClasses(): string {
    return this.hasOperations ? 'with-line' : '';
  }

  private checkIfUserHasOperations(): boolean {
    return this.operationsList?.length > 0;
  }

  async showProviderInfo() {
    if (!this.isInfoModalOpen) {
      this.isInfoModalOpen = true;
      await this.createKriptonInfoModal();
      this.isInfoModalOpen = false;
    }
  }

  async createKriptonInfoModal() {
    const modal = await this.modalController.create({
      component: InfoProviderKriptonComponent,
      cssClass: 'ux-lg-modal-informative-provider-kripton',
      backdropDismiss: false,
    });
    await modal.present();
  }

  async setEmail() {
    this.loggedEmail = await this.kriptonStorageService.get('email');
  }

  kriptonLogout() {
    this.removeKeys();
    this.isLogged = false;
    this.loggedOut.emit();
  }

  removeKeys() {
    this.kriptonStorageService.removeCredentials();
  }

  async showLogoutAlert() {
    const modal = await this.modalController.create({
      component: TwoButtonsAlertComponent,
      cssClass: 'modal two-button-xl',
      backdropDismiss: false,
      componentProps: {
        title: this.translate.instant('fiat_ramps.operations_list.log_out_modal.title'),
        description: this.translate.instant('fiat_ramps.operations_list.log_out_modal.description'),
        confirmButton: this.translate.instant('fiat_ramps.operations_list.log_out_modal.confirm_button'),
        cancelButton: this.translate.instant('fiat_ramps.operations_list.log_out_modal.cancel_button'),
      },
    });
    await modal.present();
    const { role } = await modal.onDidDismiss();
    if (role === 'confirm') {
      this.kriptonLogout();
    }
  }
}
