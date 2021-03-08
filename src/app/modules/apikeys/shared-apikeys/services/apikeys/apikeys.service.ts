import { Injectable } from '@angular/core';

interface ApiKeysInterface{
  id:number;
  ak:string;
  secret:string;
  alias:string;
}


@Injectable({
  providedIn: 'root'
})
export class ApikeysService {


  constructor() { }

  public updateData(data: ApiKeysInterface) {
    return; 
}
}



