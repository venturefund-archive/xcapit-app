import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

import { ContactItemComponent } from './contact-item.component';

describe('ContactItemComponent', () => {
  let component: ContactItemComponent;
  let fixture: ComponentFixture<ContactItemComponent>;
  const fakeData = {
    name: 'TestWallet',
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    networks:['MATIC']
  }
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ContactItemComponent],
      imports: [IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactItemComponent);
    component = fixture.componentInstance;
    component.address = fakeData.address
    component.name = fakeData.name
    component.networks = fakeData.networks
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render default properly', () => {
    const imgEl = fixture.debugElement.query(By.css('img.ci__img'));
    const nameEl = fixture.debugElement.query(By.css('div.ci__data__title > ion-text')); 
    const networkEl = fixture.debugElement.query(By.css('app-token-network-badge')); 
    const addressEl = fixture.debugElement.query(By.css('div.ci__data__subtitle > ion-text')); 
    expect(imgEl.attributes.src).toContain('/assets/img/contacts/wallet.svg');
    expect(nameEl.nativeElement.innerHTML).toContain(fakeData.name);
    expect(addressEl.nativeElement.innerHTML).toContain(fakeData.address);
    expect(networkEl).toBeTruthy();
  });

  it('should not render wallet img', () => {
    component.showWalletImg = false;
    fixture.detectChanges();
    const imgEl = fixture.debugElement.query(By.css('img.ci__img'));
    expect(imgEl).toBeNull()
  });
});
