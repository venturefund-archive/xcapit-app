import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { RuleCardComponent } from './rule-card.component';

describe('RuleCardComponent', () => {
  let component: RuleCardComponent;
  let fixture: ComponentFixture<RuleCardComponent>;
  let ruleSpy: jasmine.SpyObj<any>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      ruleSpy = jasmine.createSpyObj(
        'rule',
        {},
        {
          title: 'testTitle',
          subtitle: 'testSubtitle',
          url: '/test/url',
        }
      );
      TestBed.configureTestingModule({
        declarations: [RuleCardComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(RuleCardComponent);
      component = fixture.componentInstance;
      component.subtitle = ruleSpy.subtitle;
      component.title = ruleSpy.title;
      component.url = ruleSpy.url;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    const [imgEl, iconEl] = fixture.debugElement.queryAll(By.css('.rc__card__content img'));
    const [title, subtitle] = fixture.debugElement.queryAll(By.css('div.rc__card__content__text ion-text'));

    expect(imgEl.attributes.src).toContain(
      'assets/img/financial-education/shared-financial-education/rule-card/circle.svg'
    );
    expect(iconEl.attributes.src).toContain(
      'assets/img/financial-education/shared-financial-education/rule-card/next.svg'
    );
    expect(title.nativeElement.innerHTML).toContain('testTitle');
    expect(subtitle.nativeElement.innerHTML).toContain('testSubtitle');
  });

  it('should navigate to rules when card is clicked', () => {
    fixture.debugElement.query(By.css('div.rc__card')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/test/url');
  });
});
