import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BrowserService } from '../../../services/browser/browser.service';
import { DynamicLink } from '../dynamic-link';

@Injectable({ providedIn: 'root' })
export class DynamicLinkInjectable {
  constructor(private browserService: BrowserService, private navController: NavController) {}

  create(url: string): DynamicLink {
    return new DynamicLink(url, this.browserService, this.navController);
  }
}
