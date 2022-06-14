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

describe('VoucherCardComponent', () => {
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

    expect(photoEl.attributes.src).toEqual(photo.dataUrl);
  })

  it ('should delete uploaded photo when delete-photo is clicked', () => {
    const removeSpy = spyOn(component.removePhoto, 'emit')
    fixture.debugElement.query(By.css('ion-button[name="delete-photo"]')).nativeElement.click();
  
    expect(removeSpy).toHaveBeenCalledTimes(1);
  })
});
