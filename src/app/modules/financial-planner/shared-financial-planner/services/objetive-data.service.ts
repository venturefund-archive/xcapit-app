import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ObjetiveDataService {
  income: number;
  expenses: number;
  
  constructor() {}
}
