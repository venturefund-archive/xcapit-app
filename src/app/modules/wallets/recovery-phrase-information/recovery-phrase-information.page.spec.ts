import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { RecoveryPhraseInformationPage } from './recovery-phrase-information.page';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

describe('RecoveryPhraseInformationPage', () => {
  let component: RecoveryPhraseInformationPage;
  let fixture: ComponentFixture<RecoveryPhraseInformationPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<RecoveryPhraseInformationPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: any;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController({});
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [RecoveryPhraseInformationPage, FakeTrackClickDirective],
        imports: [RouterTestingModule, IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [TranslateService, { provide: NavController, useValue: navControllerSpy }],
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

  it('should call trackEvent on trackService when ux_phrase_continue Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_phrase_continue');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/recovery/read']);
  });
});
