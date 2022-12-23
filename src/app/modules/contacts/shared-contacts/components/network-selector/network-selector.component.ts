import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroupDirective, UntypedFormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { NetworkSelectorModalComponent } from '../network-selector-modal/network-selector-modal.component';


@Component({
  selector: 'app-network-selector',
  template: `
    <div class="ns">
      <ion-label class="ux-font-titulo-xs" color="primary">{{ 'contacts.shared_contacts.network_selector.label' | translate }}</ion-label>
      <ion-list>
        <ion-item [disabled]="this.isModalOpen" (click)="this.openModal()" class="ns__item">
          <ion-input [formControlName]="this.controlName"></ion-input>
          <ion-icon class="ns__item__arrow_icon" slot="end" name="ux-down"></ion-icon>
        </ion-item>
      </ion-list>
    </div>
  `,
  styleUrls: ['./network-selector.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class NetworkSelectorComponent implements OnInit {
  isModalOpen = false;
  control: AbstractControl;
  @Input() controlName;
  @Input() networks = [];
  constructor(private form: FormGroupDirective, private modalController: ModalController) {}

  ngOnInit() {
    this.control = this.form.control.get(this.controlName);
  }

  async openModal() {
    if (!this.isModalOpen) {
    this.isModalOpen = true;
    const modal = await this.modalController.create({
      component: NetworkSelectorModalComponent,
      cssClass: 'ux-routeroutlet-modal small-wallet-password-modal',
      backdropDismiss:true,
      componentProps:{
        networks: this.networks
      }
    });

    await modal.present();
    const data = await modal.onDidDismiss();
    this.isModalOpen = false;
    this.setSelectedValue(data.data);
    }
  }

  setSelectedValue(value: any) {
    this.control.patchValue(value);
  }
}
