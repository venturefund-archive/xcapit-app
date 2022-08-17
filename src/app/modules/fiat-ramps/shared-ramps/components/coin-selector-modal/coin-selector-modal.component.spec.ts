import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { CoinSelectorModalComponent } from './coin-selector-modal.component';

describe('CoinSelectorModalComponent', () => {
  let component: CoinSelectorModalComponent;
  let fixture: ComponentFixture<CoinSelectorModalComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;

  beforeEach(waitForAsync(() => {
    navControllerSpy = new FakeNavController().createSpy();
    fakeModalController = new FakeModalController({});
    modalControllerSpy = fakeModalController.createSpy();
    TestBed.configureTestingModule({
      declarations: [ CoinSelectorModalComponent ],
      imports: [IonicModule.forRoot(),TranslateModule.forRoot()],
      providers: [        
        { provide: NavController, useValue: navControllerSpy },        
        { provide: ModalController, useValue: modalControllerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CoinSelectorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dismiss and navigate to token selection', () => {
    component.ngOnInit()
    fixture.debugElement.query(By.css('ion-button[name="Submit"]')).nativeElement.click();
    fixture.detectChanges();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1)
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(['/fiat-ramps/token-selection'])
  });

});
