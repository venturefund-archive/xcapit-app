import { Component } from '@angular/core';
import { Utils } from 'bitcore-wallet-client/ts_build/lib/common';
import { Key } from 'bitcore-wallet-client/ts_build/lib/key';
import { BitcoreLib } from 'crypto-wallet-core';
import * as _ from 'lodash';
import { BwcService } from '../shared-wallets/services/bwc/bwc.service';

@Component({
  selector: 'app-test-wallet',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/profiles/success"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'apikeys.insert_key.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-button (click)="this.createWallet()">Crear nueva wallet</ion-button>
    </ion-content>
  `,
  styleUrls: ['./test-wallet.page.scss'],
})
export class TestWalletPage {
  client;
  key;

  constructor(private bwcSeriviceService: BwcService) {}
  clientText: string;

  ionViewWillEnter() {}

  createWallet() {
    const client = this.bwcSeriviceService.getClient();
    const key = new Key({
      seedType: 'new',
      useLegacyCoinType: false,
      useLegacyPurpose: false,
    });

    client.fromString(
      key.createCredentials('test', {
        coin: 'btc',
        network: 'testnet',
        account: 0,
        n: 1,
        m: 1,
      })
    );
    ``;
    client.credentials.m = 1;
    console.log(client.credentials);

    client.createWallet(
      'Test Wallet',
      'Federico',
      client.credentials.m,
      client.credentials.n,
      {
        coin: 'btc',
        network: 'testnet',
        singleAddress: false,
        useNativeSegwit: true,
        walletPrivKey: client.credentials.walletPrivKey,
      },
      (err) => {
        if (err) {
          console.log('error: ', err);
          return;
        } else {
          console.log('Éxito');
        }
      }
    );
  }

  _createWallet() {
    // this.client.credentials = this.key.createCredentials("test", { coin: 'btc', network: 'livenet', account: 0, n: 2, m: 2 });
    // console.log(this.client.credentials);

    // this.client.createWallet("My Wallet", "Irene", 2, 2, {network: 'livenet'}, function(err, secret) {
    //   if (err) {
    //     console.log('error: ',err);
    //     return;
    //   };
    //   // Handle err
    //   console.log('Wallet Created. Share this secret with your copayers: ' + secret);
    //   this.clientText = this.client.export();
    // });

    const message = ['Hola buenas tardes', 'Something else', 'POST'];
    const privKey = '3d7384c5695070d5a07bab99847793e73464dafba1d7bc3aca5c1391e8789a98';

    // const signature = Utils.signMessage(message, privKey);
    // console.log(signature);

    const priv = new BitcoreLib.PrivateKey(privKey);
    // console.log(priv);
    const flattenedMessage = _.isArray(message) ? _.join(message) : message;
    // console.log(flattenedMessage);
    const hash = Utils.hashMessage(flattenedMessage);
    // console.log(hash);
    // const signature = BitcoreLib.crypto.ECDSA.sign(hash, priv, 'little').toString();

    // const ecdsa = BitcoreLib.crypto.ECDSA();

    // ecdsa.set({
    //   hashbuf: hash,
    //   endian: 'little',
    //   privkey: priv
    // });

    // console.log(ecdsa);

    // ecdsa.sign();

    const sig = BitcoreLib.crypto
      .ECDSA()
      .set({
        hashbuf: hash,
        endian: 'little',
        privkey: priv,
      })
      .sign().sig;

    // console.log(sig);
    // const buf = sig.toDER();
    // console.log(sig.r);
    // console.log(sig.s);

    // const opts = { endian: 'little' };
    // const buf, hex;

    // hex = sig.r.toString(16, 2);
    // buf = Buffer.from(hex, 'hex');

    // if (typeof opts !== 'undefined' && opts.endian === 'little') {
    //   const buf2 = Buffer.alloc(buf.length);
    //   for (const i = 0; i < buf.length; i++) {
    //     buf2[i] = buf[buf.length - 1 - i];
    //   }
    //   buf = buf2;
    // }

    // const rnbuf = buf;

    // console.log(rnbuf);

    // buf = null;
    // hex = null;

    // hex = sig.s.toString(16, 2);
    // buf = Buffer.from(hex, 'hex');

    // if (typeof opts !== 'undefined' && opts.endian === 'little') {
    //   const buf2 = Buffer.alloc(buf.length);
    //   for (const i = 0; i < buf.length; i++) {
    //     buf2[i] = buf[buf.length - 1 - i];
    //   }
    //   buf = buf2;
    // }

    // const snbuf = buf;
    // console.log(snbuf);

    // buf = null;
    // const BN = BitcoreLib.crypto.BN;

    // const rnbuf = new BN(sig.s);
    // const snbuf = sig.s.toBuffer();

    const rnbuf = sig.r.toBuffer();
    const snbuf = sig.s.toBuffer();

    const rneg = rnbuf[0] && 0x80 ? true : false;
    const sneg = snbuf[0] && 0x80 ? true : false;

    const rbuf = rneg ? Buffer.concat([Buffer.from([0x00]), rnbuf]) : rnbuf;
    const sbuf = sneg ? Buffer.concat([Buffer.from([0x00]), snbuf]) : snbuf;

    const rlength = rbuf.length;
    const slength = sbuf.length;
    const length = 2 + rlength + 2 + slength;
    const rheader = 0x02;
    const sheader = 0x02;
    const header = 0x30;

    const der = Buffer.concat([
      Buffer.from([header, length, rheader, rlength]),
      rbuf,
      Buffer.from([sheader, slength]),
      sbuf,
    ]);

    const buf = der;

    console.log(buf);
    const str = buf.toString('hex');
    console.log(str);
    // const $ = BitcoreLib.util.preconditions;

    // const hashbuf = hash;
    // const privkey = priv;
    // const d = privkey.bn;

    // console.log(hashbuf);
    // console.log(privkey);
    // console.log(d);

    // $.checkState(hashbuf && privkey && d, new Error('invalid parameters'));
    // $.checkState(BitcoreLib.util.buffer.isBuffer(hashbuf) && hashbuf.length === 32, new Error('hashbuf must be a 32 byte buffer'));

    // const endian;

    // const e = BitcoreLib.crypto.BN.fromBuffer(hashbuf, endian ? {
    //   endian: endian
    // } : undefined);

    // const obj = BitcoreLib.crypto.ECDSA._findSignature(d, e);
    // // obj.compressed = this.pubkey.compressed;

    // const sig = new BitcoreLib.crypto.Signature(obj);

    // console.log(sig);
  }
}
