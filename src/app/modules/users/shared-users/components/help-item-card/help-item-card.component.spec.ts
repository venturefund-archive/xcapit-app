import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { HelpItemCardComponent } from './help-item-card.component';

describe('HelpItemCardComponent', () => {
  let component: HelpItemCardComponent;
  let fixture: ComponentFixture<HelpItemCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<HelpItemCardComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    TestBed.configureTestingModule({
      declarations: [ HelpItemCardComponent, FakeTrackClickDirective ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: NavController, useValue: navControllerSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HelpItemCardComponent);
    component = fixture.componentInstance;
    component.item = {title:'testTitle', description: 'testDescription', icon:'assets/ux-icons/ux-wallet-infolight.svg',  route: '/wallets/create-first/disclaimer'}
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    const titleEl = fixture.debugElement.query(By.css('div.hic__content__body__title ion-text'))
    const descriptionEl = fixture.debugElement.query(By.css('div.hic__content__body__description ion-text'))
    const iconEl = fixture.debugElement.query(By.css('div.hic__content__icon img'))

    expect(titleEl.nativeElement.innerHTML).toContain('testTitle');
    expect(descriptionEl.nativeElement.innerHTML).toContain('testDescription');
    expect(iconEl.attributes['src']).toContain('assets/ux-icons/ux-wallet-infolight.svg');
  });

  it('should call trackEvent on trackService when Select clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Select');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/wallets/create-first/disclaimer')
  });
});
