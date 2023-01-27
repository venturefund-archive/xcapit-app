import { ComponentFixture, TestBed, fakeAsync, waitForAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { TycItemCardComponent } from './tyc-item-card.component';

describe('TycItemCardComponent', () => {
  let component: TycItemCardComponent;
  let fixture: ComponentFixture<TycItemCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<TycItemCardComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;

  const testItems = {
    name: 'TyC-inch',
    img: '/assets/img/users/term-and-conditions/logo-xcapit.svg',
    title: 'profiles.user_profile_menu.terms_and_conditions.tyc',
    route: 'https://www.xcapit.com/terminos-y-condiciones',
    items: [],
  };

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    TestBed.configureTestingModule({
      declarations: [TycItemCardComponent, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: ModalController, useValue: modalControllerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TycItemCardComponent);
    component = fixture.componentInstance;
    component.item = testItems;
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
    expect(titleEl.nativeElement.innerHTML).toContain(testItems.title);
    expect(imageEl.attributes.src).toEqual(testItems.img);
  });

  it('should emit event when item is clicked', () => {
    const spy = spyOn(component.openBrowser, 'emit');
    testItems.items = undefined;
    component.ngOnInit();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('div.tcic__wrapper__content ion-text')).nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit event when sub item is clicked', async () => {
    testItems.items = [
      {
        name: 'testName',
        subtitle: 'testSubtitle',
        route: 'testRoute',
      },
      {
        name: 'testName',
        subtitle: 'testSubtitle',
        route: 'testRoute',
      },
    ];
    const spy = spyOn(component.openBrowser, 'emit');
    component.ngOnInit();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('div.tcic__wrapper__content__subtitle')).nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should open modal as alert when img to remove item is clicked', () => {
    fixture.debugElement.query(By.css('div.tcic__wrapper__content img')).nativeElement.click();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should emit event to remove item when img to remove item is clicked and data is confirm', fakeAsync(() => {
    fakeModalController.modifyReturns({ data: 'confirm' }, {});
    const spy = spyOn(component.itemToRemove, 'emit');
    fixture.detectChanges();
    tick();
    fixture.debugElement.query(By.css('div.tcic__wrapper__content img')).nativeElement.click();
    tick();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
  }));

  it('should set correct message on init if item is different to kripton', fakeAsync(() => {
    testItems.name = 'TyC-inch';
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    expect(component.message).toEqual(
      'profiles.user_profile_menu.terms_and_conditions.remove_tyc.message_others_providers'
    );
  }));

  it('should set correct message on init if item is equal to kripton', () => {
    testItems.name = 'kripton';
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.message).toEqual('profiles.user_profile_menu.terms_and_conditions.remove_tyc.message_to_kripton');
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
