import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroupDirective, UntypedFormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { SwapInProgressModalComponent } from 'src/app/modules/wallets/shared-wallets/components/swap-in-progress-modal/swap-in-progress-modal.component';
import { CheckboxModalComponent } from '../checkbox-modal/checkbox-modal.component';

@Component({
  selector: 'app-multiple-checkbox-select',
  template: `
    <div class="uxselect">
      <ion-label class="ux-font-titulo-xs" color="primary">{{ 'Red' }}</ion-label>
      <ion-list>
        <ion-item (click)="this.openModal()" class="uxselect__item">
          <ion-input [formControlName]="this.formControlName" >
          </ion-input>
          <ion-icon class="uxselect__item__arrow_icon" slot="end" name="ux-down"></ion-icon>
        </ion-item>
      </ion-list>
    </div>
  `,
  styleUrls: ['./multiple-checkbox-select.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class MultipleCheckboxSelectComponent implements OnInit {
  control: AbstractControl;
  @Input() formControlName;
  @Input() networks = [];
  constructor(private form: FormGroupDirective, private modalController: ModalController) {}

  ngOnInit() {
    console.log(this.formControlName)
    this.control = this.form.control.get(this.formControlName);
    console.log(this.control)
    console.log(this.networks)
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: CheckboxModalComponent,
      cssClass: 'ux-routeroutlet-modal small-wallet-password-modal',
      backdropDismiss:true,
      componentProps:{
        networks: this.networks
      }
    });

    await modal.present();

    const data = await modal.onDidDismiss();
    this.setSelectedValue(data)
    
  }

  setSelectedValue(value: any) {
    this.control.patchValue(value, { emitEvent: false });
  }
}
