import { ViewContainerRef, TemplateRef } from '@angular/core';
import { FeatureFlag } from '../feature-flag.interface';

export default class DefaultFeatureFlag implements FeatureFlag {
  constructor(
    private readonly viewContainer: ViewContainerRef,
    private readonly templateRef: TemplateRef<any>,
    private readonly enabled: () => Promise<boolean> | boolean
  ) {}

  public async evaluate(): Promise<void> {
    (await this.enabled()) ? this.renderView() : this.clearView();
  }

  private renderView(): void {
    this.viewContainer.createEmbeddedView(this.templateRef);
  }

  private clearView(): void {
    this.viewContainer.clear();
  }
}
