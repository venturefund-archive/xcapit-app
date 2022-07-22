import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationExtras } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { CauseComponent } from './cause.component';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';

const testCause = {
  id: 'water',
  image: 'assets/img/donations/causes/cause_1/image.jpg',
  title: 'UNHCR',
  logo: 'assets/img/donations/causes/cause_1/logo.svg',
  type: 'humanitary',
};

describe('CauseComponent', () => {
  let component: CauseComponent;
  let fixture: ComponentFixture<CauseComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [CauseComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(CauseComponent);
      component = fixture.componentInstance;
      component.cause = testCause;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', async () => {
    component.ngOnInit();
    await fixture.whenStable();
    await fixture.whenRenderingDone();

    const imgEl = fixture.debugElement.query(By.css('.cc__image img'));
    const logoEl = fixture.debugElement.query(By.css('.cc__logo img'));
    const textEl = fixture.debugElement.query(By.css('.cc__text-badge__text ion-text'));
    const badgeEl = fixture.debugElement.query(By.css('.cc__text-badge__badge'));

    expect(logoEl.attributes.src).toContain('assets/img/donations/causes/cause_1/logo.svg');
    expect(textEl.nativeElement.innerHTML).toContain('UNHCR');
    expect(imgEl.attributes.src).toContain('assets/img/donations/causes/cause_1/image.jpg');
    expect(badgeEl.nativeNode.innerHTML).toContain('donations.causes.types.humanitary');
  });

  it('should navigate to description cause when component is clicked', async () => {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        cause: 'water',
      },
    };
    fixture.debugElement.query(By.css('.content')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(
      ['donations/description-cause'],
      navigationExtras
    );
  });
});
