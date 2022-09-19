import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { RemoveAccountModalComponent } from './remove-account-modal.component';
import { FakeModalController } from '../../../../../../testing/fakes/modal-controller.fake.spec';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';

describe('RemoveAccountModalComponent', () => {
  let component: RemoveAccountModalComponent;
  let fixture: ComponentFixture<RemoveAccountModalComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<RemoveAccountModalComponent>;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = new FakeNavController().createSpy();
      modalControllerSpy = new FakeModalController().createSpy();
      TestBed.configureTestingModule({
        declarations: [RemoveAccountModalComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: ModalController, useValue: modalControllerSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(RemoveAccountModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the modal confirming the deletion of the account when remove_account_button button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'remove_account_button');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith(true);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should close the modal canceling the deletion of the account when cancel_button button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'cancel_button');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith(false);
  });

  it('should call trackEvent on trackService when wallet_faqs button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'wallet_faqs');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/support/faqs/wallet'])
    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith(false);
  });

  it('should dismiss on navigate to FAQs', async () => {
    
  });
});
