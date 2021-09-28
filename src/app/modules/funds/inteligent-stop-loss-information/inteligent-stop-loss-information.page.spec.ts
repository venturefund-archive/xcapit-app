import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';

import { InteligentStopLossInformationPage } from './inteligent-stop-loss-information.page';

describe('InteligentStopLossInformationPage', () => {
  let component: InteligentStopLossInformationPage;
  let fixture: ComponentFixture<InteligentStopLossInformationPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<InteligentStopLossInformationPage>;
  let navControllerSpy: any;
  let fakeNavController: FakeNavController;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController({}, Promise.resolve(), {});
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [InteligentStopLossInformationPage, TrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
        providers: [
          {
            provide: NavController,
            useValue: navControllerSpy,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(InteligentStopLossInformationPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Create Fund button clicked', () => {
    const button = trackClickDirectiveHelper.getByElementByName('ion-button', 'Back');
    const directive = trackClickDirectiveHelper.getDirective(button);
    const spy = spyOn(directive, 'clickEvent');
    button.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to "/funds/fund-stop-loss" when Back button clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="Back"]')).nativeElement.click();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledWith(['/funds/fund-stop-loss']);
  });
});
