import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BitrefillPage } from './bitrefill.page';
import { LanguageService } from '../../../shared/services/language/language.service';
import { FakeModalController } from '../../../../testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { By } from '@angular/platform-browser';

describe('BitrefillPage', () => {
  let component: BitrefillPage;
  let fixture: ComponentFixture<BitrefillPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let languageServiceSpy: jasmine.SpyObj<LanguageService>;

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController(null, { role: 'confirm' });
    modalControllerSpy = fakeModalController.createSpy();
    navControllerSpy = new FakeNavController().createSpy();
    languageServiceSpy = jasmine.createSpyObj('LanguageService', {
      getSelectedLanguage: Promise.resolve('pt'),
    });
    TestBed.configureTestingModule({
      declarations: [BitrefillPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: LanguageService, useValue: languageServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BitrefillPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render iframe with the proper url', async () => {
    component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const iframeEl = fixture.debugElement.query(By.css('iframe'));

    expect(iframeEl.attributes.src).toEqual('https://www.bitrefill.com/embed/?paymentMethod=ethereum&hl=pt');
  });

  it('should render modal when exit button is clicked and should navigate to home wallet when user confirms', async () => {
    const exitButtonEl = fixture.debugElement.query(By.css('ion-buttons > ion-button[name="goBack"]'));
    exitButtonEl.nativeElement.click();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith('/tabs/wallets');
  });

  it('should render modal when exit button is clicked and should navigate to home wallet when user cancels', async () => {
    fakeModalController.modifyReturns(null, { role: 'cancel' });
    fixture.detectChanges();
    const exitButtonEl = fixture.debugElement.query(By.css('ion-buttons > ion-button[name="goBack"]'));
    exitButtonEl.nativeElement.click();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    expect(navControllerSpy.navigateBack).not.toHaveBeenCalled();
  });
});
