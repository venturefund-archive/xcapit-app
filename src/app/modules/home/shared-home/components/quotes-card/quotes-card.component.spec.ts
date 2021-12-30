import { HttpClientTestingModule } from '@angular/common/http/testing';
import { componentFactoryName } from '@angular/compiler';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { QuotesCardComponent } from './quotes-card.component';

fdescribe('QuotesCardComponent', () => {
  let component: QuotesCardComponent;
  let fixture: ComponentFixture<QuotesCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<QuotesCardComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [QuotesCardComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
      }).compileComponents();

      fixture = TestBed.createComponent(QuotesCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Open Accordion button is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Open Accordion');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Close Accordion button is clicked', () => {
    component.openedAccordeon = true;
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Close Accordion');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  // it('should expand accordion when Open Accordion button is clicked', () => {
  //   fixture.detectChanges();
  //    fixture.debugElement.query(By.css('ion-button[name="Have A Binance Account"]')).nativeElement.click();
  //   const accordion = fixture.debugElement.query(By.css('ion-accordion.accordion'));
  //   buttonEl.nativeElement.click();
  //   fixture.detectChanges();
  //   console.log(accordion)
  //   expect(accordion.classes['accordion-expanded']).toBe(true);
  // });

  it('should collapse accordion when Close Accordion button is clicked', () => {
    component.accordionGroup.value = 'quotes';
    component.openedAccordeon = true;
    fixture.detectChanges();
    const accordion = fixture.debugElement.query(By.css('.accordion'));
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="Close Accordion"]'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    console.log();
    expect(accordion.classes['accordion-collapsed']).toBe(true);
  });
});
