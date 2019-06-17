import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-binance-apikey-tutorial-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Binance - API Keys
        </ion-title>
        <ion-buttons slot="end">
          <ion-button icon-only shape="round" (click)="closeModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      <h2 class="ion-text-center">Crear APIkey Y SECRETkey En Binance</h2>
      <p>
        Vamos a gestionar la clave para generar la apiKey y el secretKey de tu
        cuenta en Binance, para ello dentro de tu cuenta dirígete a donde dice
        “API, Creating an API private key provides access to markets and
        real-time trading services on Binance via a third-party site or
        application.” y haz click en API Setting
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/apiKeyNew/1.png"
      ></ion-img>
      <p>
        Debes ingresar una clave para luego generar el APIkey, esta clave puede
        ser una combinación de letras y números, la que más te guste y haz click
        en “Crear nueva clave”
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/apiKeyNew/2.png"
      ></ion-img>
      <p>
        Ten a mano tu móvil, Binance te solicitará el código de segundo factor
        de autenticación de Google, ingresalo y haz click en enviar
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/apiKeyNew/3.png"
      ></ion-img>
      <p>
        Binance te enviará un correo al e-mail con el que te registraste,
        recuerda que si no lo encuentra en tu bandeja de entrada, revisa el
        correo spam. Haz click en el link del correo que recibiste
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/apiKeyNew/4.png"
      ></ion-img>
      <p>Listo, tu APIkey y SECRETkey estan creados, haz click en cerrar.</p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/apiKeyNew/5.png"
      ></ion-img>
      <p>
        Lo único que queda por hacer es copiar y pegar el APIkey y SecretKey
        donde lo requieras.
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/apiKeyNew/6.png"
      ></ion-img>
      <p>
        Recuerda que esta información es importante y requiere que cuides de
        ella, no las compartas ni envies a terceros que no sean de tu confianza.
      </p>
    </ion-content>
  `,
  styleUrls: ['./binance-apikey-tutorial-modal.component.scss']
})
export class BinanceApikeyTutorialModalComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }
}
