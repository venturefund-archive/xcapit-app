import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';

import { InformativeModalComponent } from './informative-modal.component';

describe('InformativeModalComponent', () => {
  let component: InformativeModalComponent;
  let fixture: ComponentFixture<InformativeModalComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<InformativeModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InformativeModalComponent, TrackClickDirective],
        imports: [IonicModule, TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [UrlSerializer, TrackClickDirective],
      }).compileComponents();

      fixture = TestBed.createComponent(InformativeModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call trackEvent on trackService when close Button clicked', () => {
    spyOn(component, 'close');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'close');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when addApiKey Button clicked', () => {
    spyOn(component, 'addApiKey');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'addApiKey');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
