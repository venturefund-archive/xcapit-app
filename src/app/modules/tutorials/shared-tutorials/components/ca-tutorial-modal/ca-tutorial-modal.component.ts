import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BinanceAddressTutorialModalComponent } from '../binance-address-tutorial-modal/binance-address-tutorial-modal.component';

@Component({
  selector: 'app-ca-tutorial-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Cryptomonedas
        </ion-title>
        <ion-buttons slot="end">
          <ion-button icon-only shape="round" (click)="closeModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      <h2>¿Como Adquirir Cryptomonedas?</h2>
      <p>
        Para poder adquirir cryptomonedas necesitas de una plataforma simple y
        profesional en la cual los usuarios, sin importar el nivel de
        conocimientos que tenga, pueda, previa registración, transferir dinero,
        comprar y vender Bitcoins.
      </p>

      <p>
        Te presentamos Bitex, desde sus inicios desarrolló negocios tanto como
        mercado de intercambio de bitcoin, pasarela de pagos en bitcoin y más
        recientemente un servicio de remesas corporativas internacionales que
        permite a empresas realizar pagos internacionales a través de
        transferencia bancaria locales, aprovechando la tecnología bitcoin y
        permitiendo a empresas realizar pagos multiples simultaneos.
      </p>

      <p>
        Te ayudaremos a registrarte y activar tu cuenta para que puedas
        transferir dinero fiduciario a tu cuenta en Bitex y así poder obtener
        tus cryptomonedas.
      </p>

      <hr />

      <h2 class="ion-text-center">Como Crear Una Cuenta En Bitex</h2>
      <p>
        Abre tu navegador favorito e ingresa a:
        <a
          href="https://bitex.la/auth/signup?r=WCS"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.bitex.la <ion-icon name="open"></ion-icon>
        </a>
      </p>
      <p>Haz clic en Registrarte</p>
      <img
        src="https://wallcryptostreet.com/static/institutional/img/newAccountBitex/es/1.png"
      >
      <p>
        Completa los campos con tu e-mail, contraseña, (la misma debe ser como
        mínimo de 6 caracteres, compuesta por números y letras con al menos una
        en mayúscula), confirmar la contraseña y tildar el check donde dice que
        no eres ciudadano Estadounidense u Holandés y haz clic en Registrate.
      </p>
      <p class="tutorial__notes">
        Nota: si tiene inconvenientes con la carga de los datos en el formulario
        ingresa a Bitex con otro navegador como Edge, Chrome o FireFox.
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newAccountBitex/es/2.png"
      ></ion-img>
      <p>
        Recibirás un correo de Bitex para que confirmes el e-mail con el que te
        registraste. Si no lo encuentras en tu bandeja de entrada, revisa el
        correo Spam. Haz clic en el link del e-mail que recibiste y continúa
        verificando la cuenta.
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newAccountBitex/es/3.png"
      ></ion-img>
      <p>Indica que eres un individuo, no una empresa.</p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newAccountBitex/es/4.png"
      ></ion-img>
      <p class="tutorial__notes">
        Ten en cuenta los requisitos de Bitex para operar localmente:
      </p>
      <ul>
        <li>
          Documento de identidad DNI vigente (a color y completamente legible)
        </li>
        <li>
          Respaldo de ingresos y ahorros (últimos 3 recibos de sueldo o facturas
          emitidas el último mes o DDJJ de Bienes Personales o Ganancias)
        </li>
        <li>Declaración de actividad</li>
        <li>Servicio a tu nombre</li>
      </ul>

      <hr />

      <p>
        A continuación seguiremos con la verificación de la cuenta, recuerda que
        todos los campos son requeridos, son cuatro pasos:
      </p>
      <p>
        Comencemos por el primer paso, completa tus datos personales
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newAccountBitex/es/5.png"
      ></ion-img>
      <p>
        Son varios campos, aquí debes subir una imagen de tu DNI de frente y
        otra del dorso, ten en cuenta que las imágenes tienen que ser nítidas, a
        color y no presentar cortes o zonas que no puedan leerse
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newAccountBitex/es/6.png"
      ></ion-img>
      <p>En el paso dos, completaras los datos de contacto</p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newAccountBitex/es/7.png"
      ></ion-img>
      <p>
        Aquí debes subir una factura de teléfono, prepaga o cualquier otro
        servicio a tu nombre con tu domicilio actual y haz clic en siguiente
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newAccountBitex/es/8.png"
      ></ion-img>
      <p>
        Como tercer paso Bitex necesita verificar de donde proviene el dinero,
        para ello completa los campos y debes proveer un scan o una imágen como
        por ejemplo el recibo de sueldo, facturas, contratos, liquidación de
        inversiones o declaraciones juradas de bienes personales. Elige el
        archivo y haz clic en siguiente.
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newAccountBitex/es/9.png"
      ></ion-img>
      <p>
        Como último paso espera la aprobación de la cuenta, puede demorar hasta
        4 días.
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/newAccountBitex/es/10.png"
      ></ion-img>
      <p>
        En caso de que existiera algún error o faltara información, Bitex se
        contactará contigo por medio del e-mail con el que te registraste.
        Estate atento a este medio.
      </p>
      <p>
        Cuando la cuenta esté aprobada podrás realizar transferencias en pesos o
        dolares a tu cuenta para así comprar BTC (Bitcoins)
      </p>
      <p>Si tienes alguna duda, contactanos</p>

      <hr />

      <h2 class="ion-text-center">
        Como Transferir Dinero A Tu Cuenta En Bitex
      </h2>
      <p class="ion-text-center">
        Para poder adquirir Bitcoins, lo primero que debes hacer es transferir
        dinero fiduciario a tu cuenta de Bitex.
      </p>
      <p>
        Abre tu navegador favorito e ingresa a:
        <a
          href="https://bitex.la"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.bitex.la <ion-icon name="open"></ion-icon>
        </a>
      </p>
      <p>
        Haz clic en Ingresar
      </p>
      <p class="tutorial__notes">
        Nota: si tiene inconvenientes con la carga de los datos en el formulario
        ingresa a Bitex con otro navegador como Edge, Chrome o FireFox.
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/transf/es/1.png"
      ></ion-img>
      <p>Una vez en tu cuenta haz clic en depositar fondos en mi cuenta</p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/transf/es/2.png"
      ></ion-img>
      <p>Haz clic en cargar USD o ARG</p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/transf/es/3.png"
      ></ion-img>
      <p>
        Bitex te proporcionará la información para que puedas realizar la
        transferencia desde tu homebanking, según tu país de origen y la moneda
        que hayas elegido
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/transf/es/4.png"
      ></ion-img>
      <p>
        Desde tu homebanking haz la transferencia para que se acredite en tu
        cuenta de bitex, te llegará un e-mail de tu banco con el aviso de
        transferencia realizada.
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/transf/es/6.png"
      ></ion-img>
      <p>
        También te llegará un e-mail de bitex, informándote que la transferencia
        está en proceso, recuerda que esto puede demorar hasta 72hs. Si pasado
        el plazo de 72 hs. hábiles aún no ves acreditado tu deposito, comunicate
        con Bitex.
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/transf/es/7.png"
      ></ion-img>
      <p>
        Una vez acreditado el saldo en tu cuenta, Bitex te enviará un e-mail
        informándote de que se ha cargado el saldo en tu cuenta
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/transf/es/8.png"
      ></ion-img>
      <p>
        Bitex, te enviará un último e-mail con la factura, términos y
        condiciones y el detalle de la operación
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/transf/es/9.png"
      ></ion-img>
      <p>Si tienes alguna duda, contactanos</p>

      <hr />

      <h2 class="ion-text-center">Como Comprar Bitcoins En Bitex</h2>
      <p class="ion-text-center">
        Una vez acreditado el saldo en tu cuenta de bitex, podrás comprar tus
        Bitcoins al mejor precio de mercado
      </p>
      <p>Para ello ve a tu cuenta de bitex y haz clic en "Exchange"</p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/comprarCryptos/es/1.png"
      ></ion-img>
      <p>
        Dentro del exchange verás el saldo de tu cuenta, en la moneda fiduciaria
        que hayas escogido (supondremos que transferiste USD), haz clic en
        comprar BTC
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/comprarCryptos/es/2.png"
      ></ion-img>
      <p>
        A continuación debes ingresar la cantidad de USD que quieres vender y el
        precio que vas a pagar para comprar tus BTC.
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/comprarCryptos/es/3.png"
      ></ion-img>
      <p class="tutorial__notes">
        Nota: Si tienes dolares en tu cuenta te recomendamos hagas clic en usar
        el mejor precio. En caso que hayas ingresado pesos argentinos, toma las
        órdenes que están en la lista de ask.
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/comprarCryptos/es/4.png"
      ></ion-img>
      <p>
        Te llegará un e-mail con el estado de la transacción en proceso. Cuando
        tengas los BTC en tu cuenta, Bitex se contactará contigo.
      </p>

      <hr />

      <h2 class="ion-text-center">Transferir Tus Bitcoins A Binance</h2>
      <p class="ion-text-center">
        Ya tienes tus Bitcoins, por lo que ya puedes hacer la transferencia de
        los mismos a Binance para que WCS Advisor pueda operar.
      </p>
      <p>
        Dentro de tu cuenta de Bitex, ve a Saldos y haz clic en Descargar BTC
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/withdraw/es/1.png"
      ></ion-img>
      <p>
        Bitex te pedirá que ingreses la dirección de BTC a la cual quieres
        enviar tus BTC, esta dirección es la que Binance te proporciona en su
        plataforma.
      </p>
      <p class="tutorial__notes">
        Nota: mira dónde encontrar la dirección a depositar tus BTC en Binance
        <a class="local-a" (click)="this.openBinanceAddress()">
          aquí
        </a>
      </p>
      <p>
        También debes ingresar la cantidad de BTC que quieres enviar, el código
        de Google Authentication y haz clic en Offload
      </p>
      <ion-img
        src="https://wallcryptostreet.com/static/institutional/img/withdraw/es/2.png"
      ></ion-img>
      <p>
        Ten en cuenta que las operaciones de envío de BTC, se realizan de lunes
        a viernes de 9 a 17hs. Los envíos de BTC están sujetos a las condiciones
        de la red.
      </p>
    </ion-content>
  `,
  styleUrls: ['./ca-tutorial-modal.component.scss']
})
export class CaTutorialModalComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }

  async openBinanceAddress() {
    const modal = await this.modalController.create({
      component: BinanceAddressTutorialModalComponent
    });
    return await modal.present();
  }
}
