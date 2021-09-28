import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UxCardInfoRobotComponent } from './ux-card-info-robot.component';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from '../../directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

describe('UxCardInfoRobotComponent', () => {
  let component: UxCardInfoRobotComponent;
  let fixture: ComponentFixture<UxCardInfoRobotComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<UxCardInfoRobotComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UxCardInfoRobotComponent, FakeTrackClickDirective, DummyComponent],
        imports: [
          HttpClientTestingModule,
          TranslateModule.forRoot(),
          IonicModule,
          RouterTestingModule.withRoutes([{ path: 'tutorials/help', component: DummyComponent }]),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(UxCardInfoRobotComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call window.open when moreInfo is called', () => {
    spyOn(window, 'open');
    component.moreInfo();
    expect(window.open).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when More Info button clicked', () => {
    spyOn(window, 'open');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'More Info');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
