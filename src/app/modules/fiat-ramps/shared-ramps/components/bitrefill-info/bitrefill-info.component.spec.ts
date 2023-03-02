import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';

import { BitrefillInfoComponent } from './bitrefill-info.component';

describe('BitrefillInfoComponent', () => {
  let component: BitrefillInfoComponent;
  let fixture: ComponentFixture<BitrefillInfoComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<BitrefillInfoComponent>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    TestBed.configureTestingModule({
      declarations: [ BitrefillInfoComponent, FakeTrackClickDirective ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: 
      [
        { provide: ModalController, useValue: modalControllerSpy },
      ],
      schemas:[CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BitrefillInfoComponent);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Close clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Close');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should close informative modal when Close clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Close"]')).nativeElement.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });
});
