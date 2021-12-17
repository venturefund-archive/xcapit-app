import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { NeedHelpCardComponent } from './need-help-card.component';

describe('NeedHelpCardComponent', () => {
  let component: NeedHelpCardComponent;
  let fixture: ComponentFixture<NeedHelpCardComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [NeedHelpCardComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(NeedHelpCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to faqs options when NHC Div is clicked', () => {
    const clickeableDiv = fixture.debugElement.query(By.css('div[class="nhc"]'));
    clickeableDiv.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['support/options']);
  });

  it('should render card title properly', () => {
    const cardTitleEl = fixture.debugElement.query(By.css('.nhc__content__body__title'));
    expect(cardTitleEl.nativeElement.innerHTML).toContain('home.home_page.need_help_card.title');
  });

  it('should render card subtitle properly', () => {
    const cardSubtitleEl = fixture.debugElement.query(By.css('.nhc__content__body__subtitle'));
    expect(cardSubtitleEl.nativeElement.innerHTML).toContain('home.home_page.need_help_card.subtitle');
  });

  it('should render card image properly', () => {
    const cardImageEl = fixture.debugElement.query(By.css('.nhc__content__img'));
    expect(cardImageEl.attributes['src']).toBe('/assets/img/home/need-help.png');
  });
});
