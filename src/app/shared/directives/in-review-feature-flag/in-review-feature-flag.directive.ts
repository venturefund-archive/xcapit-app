import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { RemoteConfigService } from '../../services/remote-config/remote-config.service';
import { App } from '@capacitor/app';
import { AppVersionInjectable } from '../../models/app-version/injectable/app-version.injectable';

@Directive({
  selector: '[inReviewAppFeatureFlag]',
})
export class InReviewFeatureFlagDirective implements OnInit {
  app = App;
  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private remoteConfigService: RemoteConfigService,
    private appVersion: AppVersionInjectable
  ) {}

  ngOnInit() {
    this.checkIfRemoteConfigIsInitialized();
  }

  private async createView() {
    if (await this.getFeatureFlag()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private checkIfRemoteConfigIsInitialized() {
    if (this.remoteConfigService.isInitialized) {
      this.createView();
    } else {
      this.remoteConfigService.initializationCompleteEvent.subscribe(() => {
        this.createView();
      });
    }
  }

  private async getFeatureFlag(): Promise<boolean> {
    const inReview = this.remoteConfigService.getFeatureFlag('inReview');
    return !((await this.appVersion.create().updated()) && inReview);
  }
}
