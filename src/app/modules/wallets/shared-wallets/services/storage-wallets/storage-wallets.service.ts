import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

const initialValues = [{ userAcceptedToS: false }, { wallets: null }];
@Injectable({
  providedIn: 'root',
})
export class StorageWalletsService {
  constructor(private storage: Storage) {}

  initializeStorage() {
    if (this.getValue('userAcceptedToS') === undefined) {
      initialValues.forEach((p) => {
        this.setValue(Object.keys(p)[0], Object.values(p)[0]);
      });
    }
  }

  setValue(key: string, value: any) {
    this.storage.set(key, value);
  }

  getValue(key: string): Promise<any> {
    return this.storage.get(key);
  }

  getAllValues(): any[] {
    const values = [];
    initialValues.forEach((p) => {
      values.push(this.getValue(Object.keys(p)[0]));
    });
    return values;
  }

  async hasAcceptedToS(): Promise<boolean> {
    return this.getValue('userAcceptedToS');
  }

  acceptToS() {
    this.setValue('userAcceptedToS', true);
  }

  getRecoveryPhrase(): Observable<string[]> {
    return new Observable((observer) =>
      observer.next([
        'insecto',
        'puerta',
        'vestido',
        'piso',
        'plato',
        'nube',
        'afuera',
        'fuego',
        'laptop',
        'libre',
        'perro',
        'niño',
      ])
    );
    // return this.getValue('recoveryPhrase');
  }
}
