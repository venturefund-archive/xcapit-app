import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { DerivedPathOptionsPage } from './derived-path-options.page';

describe('DerivedPathOptionsPage', () => {
  let component: DerivedPathOptionsPage;
  let fixture: ComponentFixture<DerivedPathOptionsPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<DerivedPathOptionsPage>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;

  beforeEach(waitForAsync(() => {
    fakeActivatedRoute = new FakeActivatedRoute();
    activatedRouteSpy = fakeActivatedRoute.createSpy();
    walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {}, { creationMethod: 'legacy' });

    TestBed.configureTestingModule({
      declarations: [DerivedPathOptionsPage, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DerivedPathOptionsPage);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set correct text when mode is import', () => {
    fakeActivatedRoute.modifySnapshotParams({ mode: 'import' });
    component.ionViewWillEnter();
    fixture.detectChanges();
    const headerEl = fixture.debugElement.query(By.css('ion-title'));
    const titleEl = fixture.debugElement.query(By.css('div.dpo__title > ion-text'));
    expect(headerEl.nativeElement.innerHTML).toContain('wallets.derived_path_options.header.import');
    expect(titleEl.nativeElement.innerHTML).toContain('wallets.derived_path_options.title.import');
  });

  it('should set correct text when mode is create', () => {
    fakeActivatedRoute.modifySnapshotParams({ mode: 'create' });
    component.ionViewWillEnter();
    fixture.detectChanges();
    const headerEl = fixture.debugElement.query(By.css('ion-title'));
    const titleEl = fixture.debugElement.query(By.css('div.dpo__title > ion-text'));
    expect(headerEl.nativeElement.innerHTML).toContain('wallets.derived_path_options.header.create');
    expect(titleEl.nativeElement.innerHTML).toContain('wallets.derived_path_options.title.create');
  });

  it('should set creation method on service when back button is clicked', () => {
    component.ionViewWillEnter();
    component.form.patchValue({ method: 'legacy' });
    fixture.debugElement.query(By.css('ion-back-button')).nativeElement.click();
    fixture.detectChanges();
    expect(walletEncryptionServiceSpy.creationMethod).toEqual('legacy');
  });

  it('should call trackEvent on trackService when ux_create_default Radio clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-radio', 'ux_create_default');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when ux_create_other Radio clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-radio', 'ux_create_other');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
