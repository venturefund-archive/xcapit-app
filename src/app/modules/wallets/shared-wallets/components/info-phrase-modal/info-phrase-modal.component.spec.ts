import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { InfoPhraseModalComponent } from './info-phrase-modal.component';
import { TrackClickDirectiveTestHelper } from '../../../../../../testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';

describe('InfoPhraseModalComponent', () => {
  let component: InfoPhraseModalComponent;
  let fixture: ComponentFixture<InfoPhraseModalComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<InfoPhraseModalComponent>;

  beforeEach(
    waitForAsync(() => {
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();
      TestBed.configureTestingModule({
        declarations: [InfoPhraseModalComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: ModalController, useValue: modalControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(InfoPhraseModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal when Close is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Close"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should close modal when ux_phrase_information is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="ux_phrase_information_confirmation"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when ux_phrase_information_confirmation button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_phrase_information_confirmation');
    const directive = trackClickDirectiveHelper.getDirective(el);

    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
