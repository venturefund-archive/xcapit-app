import { NavController } from '@ionic/angular';
import { BrowserService } from '../../services/browser/browser.service';

export class DynamicLink {
  _rootURL = 'app.xcapit.com/';
  _externalRootURL = `app.xcapit.com/links/`;
  constructor(private readonly _url, private readonly _browser: BrowserService, private readonly _nav: NavController) {}

  public redirect(): void {
    if (this.isNotWalletConnectLink()) {
      this.urlIsExternal() ? this.openBrowser() : this.navigateInApp();
    }
  }

  private isNotWalletConnectLink(): boolean {
    return !this._url.includes('/links/wc');
  }

  private urlIsExternal(): boolean {
    return this._url.includes(this._externalRootURL);
  }

  private navigateInApp(): void {
    const appRoute = this._url.split(this._rootURL).pop();
    if (appRoute) this._nav.navigateForward(appRoute);
  }

  private openBrowser(): void {
    const externalURL = this._url.split(this._externalRootURL).pop();
    if (externalURL) this._browser.open({ url: externalURL });
  }
}
