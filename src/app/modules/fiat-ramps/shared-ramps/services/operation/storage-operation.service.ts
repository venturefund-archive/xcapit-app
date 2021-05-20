import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface OperationDataInterface {
  pais: string;
  operacion: string;
  par: string;
  monto_entrada: string;
  monto_salida: string;
  moneda_entrada: string;
  moneda_salida: string;
  precio_entrada: string;
  precio_salida: string;
  wallet: string;
}

@Injectable({
  providedIn: 'root'
})
export class StorageOperationService {
  constructor() { }

  initial = {
    pais: '',
    operacion: '',
    par: '',
    monto_entrada: '',
    monto_salida: '',
    moneda_entrada: '',
    moneda_salida: '',
    precio_entrada: '',
    precio_salida: '',
    wallet: ''
  }

  private dataSource = new BehaviorSubject<OperationDataInterface>(this.initial);
  data = this.dataSource.asObservable();
  valid = false;

  public updateData(data: OperationDataInterface) {
    this.dataSource.next(data);
    this.valid = true;
  }

  public clear() {
    this.dataSource.next(this.initial);
    this.valid = false;
  }
}
