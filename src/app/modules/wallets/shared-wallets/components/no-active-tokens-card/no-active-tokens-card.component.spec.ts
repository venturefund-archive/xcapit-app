import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { NoActiveTokensCardComponent } from './no-active-tokens-card.component';

describe('NoActiveTokensCardComponent', () => {
  let component: NoActiveTokensCardComponent;
  let fixture: ComponentFixture<NoActiveTokensCardComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    TestBed.configureTestingModule({
      declarations: [ NoActiveTokensCardComponent ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NoActiveTokensCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to token selection page when Activate button is clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="Activate"]')).nativeElement.click();

    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['wallets/select-coins', 'edit']);
  })

  it('should set title text to send if operation is send', () => {
    component.operation = 'send'
    component.ngOnInit();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('ion-text[name="Title"]')).nativeElement.innerHTML;

    expect(title).toContain('wallets.shared_wallets.no_active_tokens_card.title.send');
  })

  it('should set title text to receive if operation is receive', () => {
    component.operation = 'receive'
    component.ngOnInit();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('ion-text[name="Title"]')).nativeElement.innerHTML;

    expect(title).toContain('wallets.shared_wallets.no_active_tokens_card.title.receive');
  })
});
