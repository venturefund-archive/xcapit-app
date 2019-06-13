import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-binance-address-tutorial-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Binance - Dirección
        </ion-title>
        <ion-buttons slot="end">
          <ion-button icon-only shape="round" (click)="closeModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      <h2>Donde Encontrar La Dirección A Depositar Tus Cryptomonedas</h2>
      <p>
        Dentro de tu cuenta de Binance, haz clic en “Fondos”, lo encontrarás en
        el menú que está en el margen superior derecho.
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/addressBinance/es/1.png"
      ></ion-img>
      <p>En el menú Fondos haz clic en “Depósitos”</p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/addressBinance/es/2.png"
      ></ion-img>
      <p>
        En el selector haz clic y escribe el nombre de la cryptomoneda que
        quieres saber la dirección (a fines prácticos buscaremos BTC). En la
        lista que despliega haz clic sobre el nombre.
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/addressBinance/es/3.png"
      ></ion-img>
      <p>
        Binance te mostrará un detalle del estado de tu cuenta de BTC, en el
        campo “BTC Dirección de depósito”, encontrarás la dirección. Haz clic en
        Copiar y ve a tu cuenta de Bitex y pega la dirección.
      </p>
      <p>Ten en cuenta que esta información es importante.</p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/addressBinance/es/4.png"
      ></ion-img>
    </ion-content>
  `,
  styleUrls: ['./binance-address-tutorial-modal.component.scss']
})
export class BinanceAddressTutorialModalComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }
}
