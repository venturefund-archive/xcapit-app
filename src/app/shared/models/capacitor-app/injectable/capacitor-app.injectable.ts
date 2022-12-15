import { Injectable } from '@angular/core';
import { App, AppPlugin } from '@capacitor/app';
import { CapacitorApp } from '../../capacitor-app/capacitor-app.interface';
import { DefaultCapacitorApp } from '../../capacitor-app/default/default-capacitor-app';

@Injectable({ providedIn: 'root' })
export class CapacitorAppInjectable {
  constructor() {}

  create(app: AppPlugin = App): CapacitorApp {
    return new DefaultCapacitorApp(app);
  }
}
