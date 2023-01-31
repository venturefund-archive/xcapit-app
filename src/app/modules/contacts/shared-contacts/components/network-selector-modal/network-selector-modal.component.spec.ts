import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { NetworkData } from '../../interfaces/network-data.interface';
import { NetworkSelectorModalComponent } from './network-selector-modal.component';

describe('NetworkSelectorModalComponent', () => {
  let component: NetworkSelectorModalComponent;
  let fixture: ComponentFixture<NetworkSelectorModalComponent>;
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
        name: 'SOLANA',
        value: 'SOLANA',
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
    TestBed.configureTestingModule({
      declarations: [NetworkSelectorModalComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: ModalController, useValue: modalControllerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(NetworkSelectorModalComponent);
    component = fixture.componentInstance;
    component.networks = networks;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should preselect previously checked networks', () => {
    networks[2].checked = true;
    component.ngOnInit();
    expect(component.selectedNetworks).toEqual([ 'RSK' ]);
  });

  it('should disable others networks when solana is preselected', () => {
    networks[1].checked = true;
    component.ngOnInit();
    expect(component.networks[0].disabled).toEqual(true);
    expect(component.networks[2].disabled).toEqual(true);
  });

  it('should disable solana when other networks are preselected', () => {
    networks[0].checked = true;
    component.ngOnInit();
    expect(component.networks[1].disabled).toEqual(true);
  });

  it('should disable others networks when solana is checked', () => {
    component.ngOnInit();
    const [ erc20CheckboxEl, solanaCheckboxEl,rskCheckboxEl] = fixture.debugElement.queryAll(By.css("ion-checkbox[name='checkbox-condition']"));
    solanaCheckboxEl.triggerEventHandler('ionChange', { detail: { checked: true }, target: { checked: true }});
    fixture.detectChanges();
    expect(erc20CheckboxEl.nativeElement.disabled).toBe(true);
    expect(rskCheckboxEl.nativeElement.disabled).toBe(true)
  });

  it('should disable solana network when some evm compatible network checked', () => {
    component.ngOnInit();
    const [ erc20CheckboxEl, solanaCheckboxEl] = fixture.debugElement.queryAll(By.css("ion-checkbox[name='checkbox-condition']"));
    erc20CheckboxEl.triggerEventHandler('ionChange', { detail: { checked: true }, target: { checked: true }});
    fixture.detectChanges();
    expect(solanaCheckboxEl.nativeElement.disabled).toBe(true);
  });

  it('should disable solana network when some evm compatible network checked', () => {
    component.networks = networks;
    component.ngOnInit();
    const erc20CheckboxEl = fixture.debugElement.query(By.css("ion-checkbox[name='checkbox-condition']"));
    erc20CheckboxEl.triggerEventHandler('ionChange', { detail: { checked: true }, target: { checked: true }});
    fixture.detectChanges();
    const closeButtonEl = fixture.debugElement.query(By.css("ion-button.nsm__header__close"));
    closeButtonEl.nativeElement.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledWith(['ERC20']);
  });

  it('should delete value on selectedNetworks when uncheck checkbox', () => {
    component.networks = networks;
    component.ngOnInit();
    component.selectedNetworks = [];
    const erc20CheckboxEl = fixture.debugElement.query(By.css("ion-checkbox[name='checkbox-condition']"));
    erc20CheckboxEl.triggerEventHandler('ionChange', { detail: { checked: true }, target: { checked: true }});
    fixture.detectChanges();
    erc20CheckboxEl.triggerEventHandler('ionChange', { detail: { checked: false }, target: { checked: false }});
    fixture.detectChanges();
    const closeButtonEl = fixture.debugElement.query(By.css("ion-button.nsm__header__close"));
    closeButtonEl.nativeElement.click();
    expect(component.selectedNetworks).toEqual([]);
  });

});
