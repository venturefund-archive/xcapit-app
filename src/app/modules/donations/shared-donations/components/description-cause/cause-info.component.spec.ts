import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { CauseInfoComponent } from './cause-info.component';

const testCause = {
  id: 'unhcr',
  image: 'assets/img/donations/causes/cause_1/image.jpg',
  title: 'UNHCR',
  logo: 'assets/img/donations/causes/cause_1/logo.svg',
  type: 'humanitary',
  title_1: 'donations.description_cause.info.unhcr.title_1',
  title_2: 'donations.description_cause.info.unhcr.title_2',
  title_3: 'donations.description_cause.info.unhcr.title_3',
  description: 'donations.description_cause.info.unhcr.description',
  social_media: [
    { logo: 'instagram', link: 'https://instagram.com/acnur', text: 'instagram.com/acnur' },
    { logo: 'twitter', link: 'https://twitter.com/ACNURamericas', text: 'twitter.com/ACNURamericas' },
    { logo: 'mail', link: 'https://argbu@unhcr.org', text: 'argbu@unhcr.org' },
  ],
  addresses: [
    {
      address: '0xFaB6d79902329D7f3242060bb7E6cd2c59E9fA66',
      token: { network: 'ERC20', value: 'ETH' },
    },
  ],
};

describe('CauseInfoComponent', () => {
  let component: CauseInfoComponent;
  let fixture: ComponentFixture<CauseInfoComponent>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;

  beforeEach(
    waitForAsync(() => {
      browserServiceSpy = jasmine.createSpyObj('BrowserService', {
        open: Promise.resolve(),
      });
      TestBed.configureTestingModule({
        declarations: [CauseInfoComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: BrowserService, useValue: browserServiceSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(CauseInfoComponent);
      component = fixture.componentInstance;
      component.data = testCause;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open social media when link is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="link_to_social_media"]')).nativeElement.click();
    fixture.detectChanges();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: testCause.social_media[0].link });
  });

  it('should set type on badge', async () => {
    fixture.detectChanges();
    const badgeEl = fixture.debugElement.query(By.css('.dc__content__card__information__group__badge'));
    expect(badgeEl.nativeElement.innerHTML).toContain('donations.causes.types.humanitary');
  });

  it('should render properly', async () => {
    component.ngOnInit();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const imgEl = fixture.debugElement.query(By.css('.dc__content__img img'));
    const logoEl = fixture.debugElement.query(By.css('.dc__content__card__image__img'));
    const cardEl = fixture.debugElement.query(By.css('.dc__content__card__information'));
    const titleEl = fixture.debugElement.query(By.css('.dc__content__general-title'));
    const subtitleEl = fixture.debugElement.query(By.css('.dc__content__subtitle'));
    const descriptionEl = fixture.debugElement.query(By.css('.dc__content__description'));
    const socialEl = fixture.debugElement.query(By.css('.dc__content__social-media'));
    const linkEl = fixture.debugElement.query(By.css('.dc__content__links'));
    expect(cardEl).toBeTruthy();
    expect(logoEl.attributes.src).toContain('assets/img/donations/causes/cause_1/logo.svg');
    expect(imgEl.attributes.src).toContain('assets/img/donations/causes/cause_1/image.jpg');
    expect(titleEl.nativeElement.innerHTML).toContain('donations.description_cause.info.unhcr.title_1');
    expect(subtitleEl.nativeElement.innerHTML).toContain('donations.description_cause.info.unhcr.title_2');
    expect(descriptionEl.nativeElement.innerHTML).toContain('donations.description_cause.info.unhcr.description');
    expect(socialEl.nativeElement.innerHTML).toContain('donations.description_cause.info.unhcr.title_3');
    expect(linkEl.nativeElement.innerHTML).toBeTruthy();
  });
});
