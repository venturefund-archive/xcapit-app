import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { SuccessPaxfulPage } from './success-paxful.page';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

describe('SuccessPaxfulPage', () => {
  let component: SuccessPaxfulPage;
  let fixture: ComponentFixture<SuccessPaxfulPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SuccessPaxfulPage>;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [SuccessPaxfulPage, FakeTrackClickDirective, DummyComponent],
        imports: [
          RouterTestingModule.withRoutes([
            { path: 'tabs/home', component: DummyComponent },
            { path: 'fiat-ramps/operations', component: DummyComponent },
          ]),
          HttpClientTestingModule,
          IonicModule,
          TranslateModule.forRoot(),
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(SuccessPaxfulPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Close Success is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Close Success');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Success Action Primary is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'My Operations');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });
});
