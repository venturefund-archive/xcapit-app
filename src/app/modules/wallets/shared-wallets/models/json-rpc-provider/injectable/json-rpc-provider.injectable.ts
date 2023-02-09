import { Injectable } from '@angular/core';
import { JsonRpcProvider } from '@ethersproject/providers';
import { providers } from 'ethers';

@Injectable({ providedIn: 'root' })
export class JsonRpcProviderInjectable {
  constructor() {}
  public create(rpc: string, ethersProviders: any = providers ): JsonRpcProvider {
    return new ethersProviders.JsonRpcProvider(rpc);
  }
}
