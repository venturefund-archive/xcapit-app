import { Injectable } from '@angular/core';
import { Network } from '../default/network';

@Injectable({ providedIn: 'root' })
export class NetworkInjectable {
  create(): Network {
    return new Network();
  }
}
