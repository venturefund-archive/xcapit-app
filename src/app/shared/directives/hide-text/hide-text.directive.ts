import { Directive,ElementRef,HostListener } from '@angular/core';
import { TrackService } from '../../services/track/track.service';


@Directive({
  selector: '[appHideText]'
})
export class HideTextDirective {
  

  
  constructor(private el: ElementRef, private trackService: TrackService) { }

  @HostListener('click', ["$event"])
  onClick($event) {
    var fundHidden 
    if(localStorage.getItem('fundHidden') == "true" ){
      fundHidden = true; 
    }else{
      fundHidden=false; 
    }
    localStorage.setItem("fundHidden",(!fundHidden).toString());
  }

  @HostListener('document:storage')
  onLoad() {
    var fundHidden 
    if(localStorage.getItem('fundHidden') == "true" ){
      fundHidden = true; 
    }else{
      fundHidden=false; 
    }
    if(fundHidden){
      this.el.nativeElement.innerText = "*******"
      
    }

    console.log("Estoy tocando el fondo");
  }

}
