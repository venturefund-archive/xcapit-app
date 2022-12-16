import { Component, OnInit } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-checkbox-modal',
  template: `
    <div class="cm__header">
      <ion-text class="ion-padding-start cm__header__text ux-font-text-lg">
        {{ 'Seleccionar Red' }}
      </ion-text>
      <ion-button
        appTrackClick
        name="Close"
        (click)="this.close()"
        fill="clear"
        size="small"
        color="neutral80"
        class="cm__header__close"
      >
        <ion-icon name="close"></ion-icon>
      </ion-button>
    </div>
    <ion-content  class="sm__content ion-padding-start ion-padding-end ion-padding-bottom">
      <ion-item lines="none" *ngFor="let network of this.networks" class="last ux-font-text-xs">
        <ion-label>
          {{ this.network.name | translate }}
        </ion-label>
        <ion-checkbox [value]="network.value" (ionChange)="this.prueba($event, network.value)" mode="md" slot="start" name="checkbox-condition"></ion-checkbox>
      </ion-item>
    </ion-content>
  `,
  styleUrls: ['./checkbox-modal.component.scss'],
})
export class CheckboxModalComponent implements OnInit {
  selectedNetworks = [];
  networks = [];
  constructor(private modalController : ModalController) {}

  ngOnInit() {}
  
  close() {
    this.modalController.dismiss(this.selectedNetworks);
  }

  prueba(event, value){
    if(this.checked(event)){
      if(!this.includes(value)){
        console.log("agrego", value)
        this.selectedNetworks.push(value)
      }
    }else{
      console.log("desactivo la siguiente:", value)
      const index = this.selectedNetworks.indexOf(value);
      this.selectedNetworks.splice(index,1)
    }
    console.log("redes seleccionadas: ", this.selectedNetworks)
  }

  checked(event){
    return event.detail.checked;
  }

  includes(value){
    return this.selectedNetworks.includes(value);
  }
  
}
