import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { By } from '@angular/platform-browser';
import { ImportMethodOptionsComponent } from './import-method-options.component';

describe('ImportMethodOptionsComponent', () => {
  let component: ImportMethodOptionsComponent;
  let fixture: ComponentFixture<ImportMethodOptionsComponent>;

  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ImportMethodOptionsComponent>;

  const fakeData = {
    img: 'assets/img/wallets/key.svg',
    title: 'fakeTitle',
    subtitle: 'fakeSubtitle',
    route: 'fakeRoute',
    name: 'ux_fake',
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ImportMethodOptionsComponent, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportMethodOptionsComponent);
    component = fixture.componentInstance;
    component.method = fakeData;
    fixture.detectChanges();

    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(
      By.css('div.imp__wrapper__content > ion-text.imp__wrapper__content__title')
    );
    const subtitleEl = fixture.debugElement.query(By.css('div.subtitle ion-text'));
    const imageEl = fixture.debugElement.query(By.css('img'));

    expect(imageEl.attributes.src).toEqual(fakeData.img);
    expect(titleEl.nativeElement.innerHTML).toContain(fakeData.title);
    expect(subtitleEl.nativeElement.innerHTML).toContain(fakeData.subtitle);
  });

  it('should call trackEvent if item is not disabled and was clicked', () => {
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getElement('ion-item');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');

    el.nativeElement.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit event when item is clicked', () => {
    const spy = spyOn(component.route, 'emit');
    component.ngOnInit();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('div.imp__wrapper__content ion-text')).nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
