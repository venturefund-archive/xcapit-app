import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EnvService {
  env: any = environment;

  constructor() {}

  all(): any {
    return this.env;
  }

  byKey(aKey: string): string {
    return this.env[aKey];
  }
}
