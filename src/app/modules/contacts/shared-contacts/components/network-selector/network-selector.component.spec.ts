import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormGroupDirective, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { NetworkData } from '../../interfaces/network-data.interface';
import { NetworkSelectorComponent } from './network-selector.component';

describe(' NetworkSelectorComponent', () => {
  let component: NetworkSelectorComponent;
  let fixture: ComponentFixture<NetworkSelectorComponent>;
  let controlContainerMock: UntypedFormGroup;
  let formGroupDirectiveMock: FormGroupDirective;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let networks: NetworkData[];
  beforeEach(waitForAsync(() => {
    networks = [
      {
        name: 'ETHEREUM',
        value: 'ERC20',
        checked: false,
        disabled: false,
      },
      {
        name: 'RSK',
        value: 'RSK',
        checked: false,
        disabled: false,
      },
    ];
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    controlContainerMock = new UntypedFormGroup({
      testControl: new UntypedFormControl(),
    });
    formGroupDirectiveMock = new FormGroupDirective([], []);
    formGroupDirectiveMock.form = controlContainerMock;
    TestBed.configureTestingModule({
      declarations: [NetworkSelectorComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: FormGroupDirective, useValue: formGroupDirectiveMock },
        { provide: NavController, useValue: navControllerSpy },
        { provide: ModalController, useValue: modalControllerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NetworkSelectorComponent);
    component = fixture.componentInstance;
    component.networks = networks;
    component.controlName = 'testControl';
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const inputEl = fixture.debugElement.query(By.css('ion-item.ns__item ion-input'));
    const arrowIconEl = fixture.debugElement.query(By.css('ion-item.ns__item ion-icon'));
    expect(inputEl).toBeTruthy();
    expect(arrowIconEl).toBeTruthy();
  });

  it('should open modal when item click', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const inputEl = fixture.debugElement.query(By.css('ion-item.ns__item'));
    inputEl.nativeElement.click();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should not allow multiple modals opening', async () => {
    fixture.debugElement.query(By.css('ion-item.ns__item')).nativeElement.click();
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('ion-item.ns__item').disabled).toBeTruthy();
  });

  it('should set select networks when modal closes', async () => {
    fakeModalController.modifyReturns({}, { data: ['ETH', 'RSK'] });
    fixture.debugElement.query(By.css('ion-item.ns__item')).nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(component.control.value).toEqual(['ETH', 'RSK']);
  });
});
