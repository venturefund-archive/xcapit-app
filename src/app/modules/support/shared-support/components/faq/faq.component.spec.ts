import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { ABOUT_XCAPIT_OPTIONS } from '../../constants/about-xcapit-account';
import { FaqComponent } from './faq.component';

describe('FaqComponent', () => {
  let component: FaqComponent;
  let fixture: ComponentFixture<FaqComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: any;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [FaqComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(FaqComponent);
      component = fixture.componentInstance;
      component.faq = ABOUT_XCAPIT_OPTIONS[0];
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change state when input is clicked', () => {
    component.showFirst = false;
    fixture.debugElement.query(By.css('input[name="Faq"]')).nativeElement.click();
    expect(component.showFirst).toBeTruthy();
  });

  it('should open the link in the app when link is clicked', () => {
    component.faq.title = 'support.support_binance.question3';
    component.faq.answer = "Test: <a href='http://test'>Haz click aquí</a>";
    spyOn(component, 'handleAnchorClick').and.callThrough();
    spyOn(component, 'openInfo').and.callThrough();
    fixture.detectChanges();
    component.ngAfterViewInit();
    const anchor = fixture.debugElement.query(By.css('a'));
    const link = anchor.nativeElement.getAttribute('href');
    anchor.nativeElement.click();
    expect(component.handleAnchorClick).toHaveBeenCalledTimes(1);
    expect(component.openInfo).toHaveBeenCalledTimes(1);
    expect(link).toEqual('http://test');
  });
});
