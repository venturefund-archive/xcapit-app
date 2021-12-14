import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { NeedHelpCardComponent } from './need-help-card.component';

describe('NeedHelpCardComponent', () => {
  let component: NeedHelpCardComponent;
  let fixture: ComponentFixture<NeedHelpCardComponent>;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', ['navigateForward']);
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

  it('should render properly', () => {
    const cardTitleEl = fixture.debugElement.query(By.css('.nhc__content__body__title'));
    expect(cardTitleEl.nativeElement.innerHTML).toContain('home.home_page.need_help_card.title');

    const cardSubtitleEl = fixture.debugElement.query(By.css('.nhc__content__body__subtitle'));
    expect(cardSubtitleEl.nativeElement.innerHTML).toContain('home.home_page.need_help_card.subtitle');

    const cardImageEl = fixture.debugElement.query(By.css('.nhc__content__img'));
    expect(cardImageEl.attributes['src']).toBe('/assets/img/home/need-help.png');
  });
});
