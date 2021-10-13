import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';

import { SuccessCreationPage } from './success-creation.page';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

describe('SuccessCreationPage', () => {
  let component: SuccessCreationPage;
  let fixture: ComponentFixture<SuccessCreationPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SuccessCreationPage>;
  let navControllerSpy: any;
  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [FakeTrackClickDirective, SuccessCreationPage],
        imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(SuccessCreationPage);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Go to Home Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Go To Home');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call goToHome when Go To Home Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Go To Home');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(component, 'goToHome');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should go to home page on goToHome', () => {
    component.goToHome();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledWith(['tabs/wallets/']);
  });
});
