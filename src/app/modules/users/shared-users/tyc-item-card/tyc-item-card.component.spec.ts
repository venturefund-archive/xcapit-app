import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { TycItemCardComponent } from './tyc-item-card.component';

describe('TycItemCardComponent', () => {
  let component: TycItemCardComponent;
  let fixture: ComponentFixture<TycItemCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<TycItemCardComponent>;

  const testItem = {
    img: '/assets/img/users/term-and-conditions/logo-xcapit.svg',
    title: 'profiles.user_profile_menu.terms_and_conditions.tyc',
    route: 'https://www.xcapit.com/terminos-y-condiciones',
    isXcapit: true,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TycItemCardComponent ,FakeTrackClickDirective],
      imports: [IonicModule.forRoot(),TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TycItemCardComponent);
    component = fixture.componentInstance;
    component.item = testItem
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly when is item', () => {
    fixture.detectChanges();
    const imageEl = fixture.debugElement.query(By.css('img'));
    const titleEl = fixture.debugElement.query(By.css('div.tcic__wrapper__content ion-text'));
    expect(titleEl.nativeElement.innerHTML).toContain(testItem.title);
    expect(imageEl.attributes.src).toEqual(testItem.img);
  });

  it('should emit event when item is clicked', () => {
    const itemEl = fixture.debugElement.query(By.css('ion-item.tcic'));
    const spy = spyOn(component.openBrowser, 'emit');
    itemEl.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent if item was clicked', () => {
    const el = trackClickDirectiveHelper.getElement('ion-item');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');

    el.nativeElement.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
