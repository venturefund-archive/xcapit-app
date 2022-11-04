import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../../../../../shared/services/env/env.service';
import { InvestedBalanceOf } from '../invested-balance-of.interface';
import { DefaultInvestedBalanceOf } from '../default/default-invested-balance-of';

@Injectable({ providedIn: 'root' })
export class InvestedBalanceOfInjectable {
  constructor(private http: HttpClient, private env: EnvService) {}

  create(anAddress: string, aPid: number): InvestedBalanceOf {
    return new DefaultInvestedBalanceOf(anAddress, aPid, this.http, this.env);
  }
}
