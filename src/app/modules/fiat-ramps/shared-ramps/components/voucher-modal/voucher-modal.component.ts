import { Component, OnInit, Input } from '@angular/core';
import { Photo } from '@capacitor/camera';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-voucher-modal',
  template: `
    <div class="modal-content">
      <div class="main__close_button">
        <ion-button class="ion-no-padding" slot="icon-only" fill="clear" name="Close" (click)="this.close()">
          <ion-icon class="main__close_button__icon" name="ux-close"></ion-icon>
        </ion-button>
      </div>
      <div class="main__body">
        <div class="main__body__content">
          <img [src]="this.voucher.dataUrl" />
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./voucher-modal.component.scss'], 
})
export class VoucherModalComponent implements OnInit {
  @Input() voucher: Photo;
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }
}
