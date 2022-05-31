import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Share } from '@capacitor/share';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';

@Component({
  selector: 'app-share-education',
  template: `
  <div *ngIf="this.isNative" class="se" (click)="this.share()">
    <img src='/assets/img/financial-education/shared-financial-education/share.svg'>
  </div>
  `,
  styleUrls: ['./share-education.component.scss'],
})
export class ShareEducationComponent implements OnInit {
  preview : string;
  asset : string;
  blob : Promise<any>
  public isNative: boolean;
  constructor(private http: HttpClient, private platformService: PlatformService,) { }
  ngOnInit() {
    this.setBlob();
    this.isNativePlatform();
   }
  
   isNativePlatform(){
    this.isNative = this.platformService.isNative();
    console.log(this.isNative)
   }

   async setBlob(){
    const blob = await this.http
    .get('/assets/img/financial-education/shared-financial-education/share-image.jpg', { responseType: 'blob' })
    .toPromise();
    return blob
   }

  async share(){ 

    const reader = new FileReader();
    reader.readAsDataURL(await this.setBlob());
    reader.onloadend = () => {
      const result = reader.result as string;
      this.preview = result;
      this.asset = result.split(',')[1]; // Imagen en base64 a enviar
    };
    
    const fileName = new Date().getTime() + 'share.jpg'; // Nombre del file que se descarga
    const savedFile = await Filesystem.writeFile({ // Guardamos file en cache
      directory: Directory.Cache,
      path: fileName,
      data: this.asset,
    });

    await Share.share({
       title: 'Señora Alegria',
       text: '¿Alguien puede pensar en los niños!?',
      url: savedFile.uri, // Mandamos la uri del file que guardamos
      dialogTitle: 'Share',
    });

    console.log("entré al share")
  }

}
