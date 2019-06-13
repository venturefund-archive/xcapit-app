import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BinanceCheckTutorialModalComponent } from '../binance-check-tutorial-modal/binance-check-tutorial-modal.component';

@Component({
  selector: 'app-binance-tutorial-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Binance - Cuenta
        </ion-title>
        <ion-buttons slot="end">
          <ion-button icon-only shape="round" (click)="closeModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      <h2>Como Crear Una Cuenta En Binance</h2>
      <p>
        Abre tu navegador favorito e ingresa a:
        <a
          href="https://www.binance.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.binance.com
        </a>
      </p>
      <p>
        Haz clic en Registrate, lo encontrarás en el margen superior derecho
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newBinance/1.png"
      ></ion-img>
      <p>
        A continuación deberás ingresar el e-mail con que quieres crear tu
        cuenta en Binance, proporcionar un password (la misma debe ser como
        mínimo de 6 caracteres, compuesta por números y letras con al menos una
        en mayúscula) y confirmar el password.
      </p>
      <p>
        En el campo “Referencial ID (optional)” encontrarás el siguiente ID:
        36552775, no lo cambies. Si está vacio ingresalo.
      </p>
      <p>
        Tilda el Check para aceptar los términos de uso de Binance y haz clic en
        Register.
      </p>
      <p class="tutorial__notes">
        Nota: si tiene inconvenientes con la carga de los datos en el formulario
        ingresa a Binance desde otro navegador como Edge, Chrome o FireFox.
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newBinance/2.png"
      ></ion-img>
      <p>
        Binance te enviará un correo al e-mail con el que te registraste para
        que confirmes el e-mail y actives la cuenta.
      </p>
      <p>
        Si no lo encuentras en tu bandeja de entrada, revisa el correo Spam. Haz
        clic en el link del e-mail que recibiste y continúa para activar tu
        cuenta.
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newBinance/3.png"
      ></ion-img>
      <p>
        El link te enviará a la siguiente página donde deberás posicionar el
        puzzle en el lugar correcto y así probar que no eres un robot.
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newBinance/4.png"
      ></ion-img>
      <p>Una vez que hayas posicionado el puzzle, has activado tu cuenta</p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newBinance/5.png"
      ></ion-img>
      <p>
        Cuando ya tengas la cuenta activa, Binance proporcionará sugerencias de
        seguridad para tu cuenta, te recomendamos tildes todas las opciones y
        haz clic en continuar.
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newBinance/6.png"
      ></ion-img>
      <p>
        Binance recomienda activar el segundo factor de autenticación de google.
        Descarga la app del playStore, buscala como: Authentication de Google.
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newBinance/7.png"
      ></ion-img>
      <p>
        Una vez descargada la app haz clic en Next Step, y sigue los pasos:
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newBinance/8.png"
      ></ion-img>
      <p>
        Desde la App, Scanear el código QR y haz clic en Next Step
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newBinance/9.png"
      ></ion-img>
      <p>Guarda la Clave proporcionada en papel y haz clic en Next Step</p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newBinance/10.png"
      ></ion-img>
      <p>
        Para finalizar con la autenticación ingresa la contraseña de acceso y el
        código de verificación proporcionado por Authentication Google.
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newBinance/11.png"
      ></ion-img>
      <p>
        Si todo salió bien, Binance te lo hará saber con el siguiente mensaje,
        sino contacta a Binance para que te brinde una solución
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newBinance/12.png"
      ></ion-img>
      <p>
        Hasta aquí has creado una cuenta en Binance, que en principio no hace
        falta verificar tu identidad para poder operar, lo que sí sólo podrás
        retirar hasta 2 BTC(Bitcoins) cada 24hs.
      </p>
      <p>
        En caso de que quieras aumentar el límite de retiro a 100 BTC por cada
        24hs, entonces sí, deberás realizar la verificación haciendo click en
        Lv.2 y comenzar con los pasos de verificación.Mirá como verificar tu
        cuenta
        <a class="local-a" (click)="this.openBinanceCheck()">
          aquí
        </a>
      </p>
    </ion-content>
  `,
  styleUrls: ['./binance-tutorial-modal.component.scss']
})
export class BinanceTutorialModalComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }

  async openBinanceCheck() {
    const modal = await this.modalController.create({
      component: BinanceCheckTutorialModalComponent
    });
    return await modal.present();
  }
}
