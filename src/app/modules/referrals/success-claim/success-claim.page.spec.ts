import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { SuccessClaimPage } from './success-claim.page';

describe('SuccessClaimPage', () => {
  let component: SuccessClaimPage;
  let fixture: ComponentFixture<SuccessClaimPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SuccessClaimPage>;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [SuccessClaimPage, TrackClickDirective],
        imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule],
        providers: [TrackClickDirective, { provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(SuccessClaimPage);
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
    expect(navControllerSpy.navigateBack).toHaveBeenCalledWith(['/tabs/home']);
  });
});
