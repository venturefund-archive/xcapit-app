import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { NewToken } from '../../interfaces/new-token.interface';

import { NewTokenAvailableCardComponent } from './new-token-available-card.component';

describe('NewTokenAvailableCardComponent', () => {
  let component: NewTokenAvailableCardComponent;
  let fixture: ComponentFixture<NewTokenAvailableCardComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<NewTokenAvailableCardComponent>;

  const fakeNewToken: NewToken = {
    name:"test-name",
    network:"test-network",
    icon:"solana-test.svg"
  }

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();


    TestBed.configureTestingModule({
      declarations: [ NewTokenAvailableCardComponent, FakeTrackClickDirective ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [  { provide: ModalController, useValue: modalControllerSpy}]
    }).compileComponents();

    fixture = TestBed.createComponent(NewTokenAvailableCardComponent);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    component = fixture.componentInstance;
    component.newToken = fakeNewToken;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show informative new token modal when card is clicked', () => {
    fixture.debugElement.query(By.css('div.ntac')).nativeElement.click();
    fixture.detectChanges();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should call appTrackEvent on trackService when card clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('div', 'ux_solana_more_info');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
