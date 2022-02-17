import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { NoWalletPage } from './no-wallet.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('NoWalletPage', () => {
  let component: NoWalletPage;
  let fixture: ComponentFixture<NoWalletPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NoWalletPage],
        imports: [IonicModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(NoWalletPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set data on will enter', () => {
    component.ionViewWillEnter();
    expect(component.data).toBeTruthy();
  });
});
