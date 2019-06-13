import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-binance-check-tutorial-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Binance - Lv.2
        </ion-title>
        <ion-buttons slot="end">
          <ion-button icon-only shape="round" (click)="closeModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      <h2>
        Como Verificar Tu Identidad En Binance Y Aumentar El Nivel De La Cuenta
        A Lv.2
      </h2>
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
        Haz clic en iniciar sesión, lo encontrarás en el margen superior derecho
      </p>
      <p class="tutorial__notes">
        Nota: si tiene inconvenientes con la carga de los datos en el formulario
        ingresa a Binance desde otro navegador como Edge, Chrome o FireFox.
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/checkBinance/1.png"
      ></ion-img>
      <p>Una vez que hayas iniciado sesión, haz click en Lv.2</p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/checkBinance/2.png"
      ></ion-img>
      <p>Haz click para verificar que eres una persona:</p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/checkBinance/3.png"
      ></ion-img>
      <p>Comenzarás con la verificación, haz click en continuar</p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/checkBinance/4.png"
      ></ion-img>
      <p>
        Elige tu país de origen y el tipo de documentación que vas a validar,
        puede ser DNI, Pasaporte o Licencia de Conducir y selecciona sobre el
        icono
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/checkBinance/5.png"
      ></ion-img>
      <p>
        Continuarás con la Verificación ingresando las imágenes de tu DNI, elige
        como subir las imágenes de tu DNI, en este caso subiremos los archivos
        desde el dispositivo
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/checkBinance/6.png"
      ></ion-img>
      <p>
        Escoge la imagen que tiene el frente del DNI y haz click en Confirmar
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/checkBinance/7.png"
      ></ion-img>
      <p>
        A continuación deberás cargar la imagen que contiene el dorso del DNI y
        haz click en Confirmar
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/checkBinance/8.png"
      ></ion-img>
      <p>
        Por último debes subir una imagen de ti mismo sosteniendo una hoja con
        la inscripción en puño y letra “Binance - Fecha de hoy” y haz click en
        Confirmar
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/checkBinance/9.png"
      ></ion-img>
      <p>Espera a que se carguen los archivos</p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/checkBinance/10.png"
      ></ion-img>
      <p>
        Cuando Binance termine de cargar los archivos te lo informará con el
        siguiente mensaje
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/checkBinance/11.png"
      ></ion-img>
      <p>
        Ahora solo te queda esperar que el equipo de Binance verifique tu
        identidad y eleve el nivel de tu cuenta a Lv.2.
      </p>
      <p>
        En caso de que existiera algún error o faltara información, Binance se
        contactará contigo por medio del e-mail con el que te registraste.
        Estate atento a este medio.
      </p>
    </ion-content>
  `,
  styleUrls: ['./binance-check-tutorial-modal.component.scss']
})
export class BinanceCheckTutorialModalComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }
}
