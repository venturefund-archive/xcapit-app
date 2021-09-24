import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { navControllerMock } from '../../../../../../testing/spies/nav-controller-mock.spec';
import { PrizeCardComponent } from './prize-card.component';
import { modalControllerMock } from '../../../../../../testing/spies/modal-controller-mock.spec';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';

describe('PrizeCardComponent', () => {
  let component: PrizeCardComponent;
  let fixture: ComponentFixture<PrizeCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<PrizeCardComponent>;
  let navControllerSpy: any;
  let modalControllerSpy: any;
  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      modalControllerSpy = jasmine.createSpyObj('ModalController', modalControllerMock);
      TestBed.configureTestingModule({
        declarations: [PrizeCardComponent, FakeTrackClickDirective],
        imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: ModalController, useValue: modalControllerSpy },
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(PrizeCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Send Email Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Send Email');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should open modal when sendEmail is called and accumulatedMoney is 0', async () => {
    component.accumulatedMoney = 0;
    fixture.detectChanges();
    await component.sendEmail();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });
});
