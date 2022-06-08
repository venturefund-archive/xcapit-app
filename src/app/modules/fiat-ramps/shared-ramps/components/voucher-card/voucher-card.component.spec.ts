import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { VoucherCardComponent } from './voucher-card.component';
import { Photo } from '@capacitor/camera';

const voucher: any = {
  dataUrl: 'assets/img/coins/ETH.svg'
}
const photo: Photo = {
  dataUrl: 'assets/img/coins/ETH.svg',
  format: '',
  saved: true
}

fdescribe('VoucherCardComponent', () => {
  let component: VoucherCardComponent;
  let fixture: ComponentFixture<VoucherCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherCardComponent ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VoucherCardComponent);
    component = fixture.componentInstance;
    component.voucher = photo
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be rendered properly', async () => {

    

    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    
    const photoEl = fixture.debugElement.query(By.css('img.vc__file__photo'));
    // const bankInfoExtraKeyEl =  fixture.debugElement.query(By.css('.bic__content__item__container__header__extra-key'))
    // const operationCurrencyAmountInEl = fixture.debugElement.query(By.css('.bic__content__item__container__content__amount'))
    // const conceptNameEl = fixture.debugElement.query(By.css('.bic__content__item__container__content__concept'));

    console.log('voucher en const: ', voucher)
    console.log('voucher en componente: ', component.voucher)
    console.log('voucher en Photo: ', photo)

    expect(photoEl.attributes.src).toEqual(photo.dataUrl);
    // expect(bankInfoExtraKeyEl.nativeElement.innerHTML).toContain('CBU');
    // expect(operationCurrencyAmountInEl.nativeElement.innerHTML).toContain('150');
    // expect(conceptNameEl.nativeElement.innerHTML).toContain('Cash In');
  })

  it ('should delete uploaded photo when delete-photo is clicked', async () => {
    // Lo esta llamando 0 veces, como manejar event emitters?
    // Es responsabilidad de la card o del componente contenedor?
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();

    fixture.debugElement.query(By.css('ion-button[name="delete-photo"]')).nativeElement.click();

    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    
    const removeSpy = spyOn(component, 'removePhotoEvent')
    expect(removeSpy).toHaveBeenCalledTimes(1);
  })
});
