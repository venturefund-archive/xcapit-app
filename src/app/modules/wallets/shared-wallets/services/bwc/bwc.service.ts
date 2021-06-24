import { Injectable } from '@angular/core';
import BWC from 'bitcore-wallet-client';

const BWS_INSTANCE_URL = 'https://bws.bitpay.com/bws/api';

@Injectable({
  providedIn: 'root',
})
export class BwcService {
  public Client = BWC;

  constructor() {}

  public getClient(walletData?, opts?): BWC {
    opts = opts || {};

    const bwc = new BWC({
      baseUrl: opts.bwsurl || BWS_INSTANCE_URL,
      verbose: opts.verbose,
      timeout: 100000,
      transports: ['polling'],
      bp_partner: opts.bp_partner,
      bp_partner_version: opts.bp_partner_version,
    });

    if (walletData) bwc.fromString(walletData);
    return bwc;
  }
}
