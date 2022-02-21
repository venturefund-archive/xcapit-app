import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ethers } from 'ethers';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { DefaultRequestComponent } from './default-request.component';

const dateInfo = {
  date: moment().utc().format('DD/MM/YYYY'),
  time: moment().utc().format('HH:mm'),
}

const request = {
  id: 1644526121229049,
  jsonrpc: "2.0",
  method: "eth_sendTransaction",
  params: [
    {
      data: "0x18cbafe50000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000001c53f6530922100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000009c7314d0745bf0df80040dabd6ce87efcc5969e80000000000000000000000000000000000000000000000000000000062057ed8000000000000000000000000000000000000000000000000000000000000000300000000000000000000000019f64674d8a5b4e652319f5e239efd3bc969a1fe000000000000000000000000cb46c0ddc60d18efeb0e586c17af6ea36452dae000000000000000000000000009b6ca5e4496238a1f176aea6bb607db96c2286e",
      from: "0x9c7314d0745bf0df80040dabd6ce87efcc5969e8",
      gas: "0x432b3",
      gasPrice: "0x3e252e0",
      to: "0xf55c496bb1058690db1401c4b9c19f3f44374961"
    }
  ]
}

const providerSymbol = 'trBTC';

describe('DefaultRequestComponent', () => {
  let component: DefaultRequestComponent;
  let fixture: ComponentFixture<DefaultRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultRequestComponent ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultRequestComponent);
    component = fixture.componentInstance;
    component.dateInfo = dateInfo;
    component.request = request;
    component. providerSymbol = providerSymbol;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTotalAmount when ngOnInit', () => {
    const spy = spyOn(component, 'getTotalAmount');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should set totalAmount null when value does not exists in request info', () => {
    component.request = request;
    fixture.detectChanges();
    component.getTotalAmount();
    expect(component.totalAmount).toBeNull();
  });

  it('shuould set totalAmount with the request value if exists', () => {
    const req = {...request, params: [...request.params]};
    req.params[0]['value'] = '5000000000000000000';
    component.request = req;
    fixture.detectChanges();
    component.getTotalAmount();
    expect(component.totalAmount).toEqual('5.0');
  })
});
