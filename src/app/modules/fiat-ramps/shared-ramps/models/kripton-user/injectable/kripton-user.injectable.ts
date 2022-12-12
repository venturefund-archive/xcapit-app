import { Injectable } from '@angular/core';
import { KriptonStorageService } from '../../../services/kripton-storage/kripton-storage.service';
import { KriptonUser } from '../kripton-user';

@Injectable({ providedIn: 'root' })
export class KriptonUserInjectable {
  constructor(private storage: KriptonStorageService) {}
  public create(): KriptonUser {
    return new KriptonUser(this.storage);
  }
}
