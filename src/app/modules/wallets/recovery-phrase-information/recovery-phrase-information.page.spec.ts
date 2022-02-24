import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { RecoveryPhraseInformationPage } from './recovery-phrase-information.page';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.spec';
import { FakeModalController } from '../../../../testing/fakes/modal-controller.fake.spec';
import { By } from '@angular/platform-browser';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { RouterTestingModule } from '@angular/router/testing';

describe('RecoveryPhraseInformationPage', () => {
  let component: RecoveryPhraseInformationPage;
  let fixture: ComponentFixture<RecoveryPhraseInformationPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<RecoveryPhraseInformationPage>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(
    waitForAsync(() => {
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();

      TestBed.configureTestingModule({
        declarations: [RecoveryPhraseInformationPage, FakeTrackClickDirective],
        imports: [RouterTestingModule, IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [TranslateService, { provide: ModalController, useValue: modalControllerSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(RecoveryPhraseInformationPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Continue Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Continue');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should open password modal when user clicks Continue Button', () => {
    fixture.debugElement.query(By.css('ion-button[name="Continue"]')).nativeElement.click();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });
});
