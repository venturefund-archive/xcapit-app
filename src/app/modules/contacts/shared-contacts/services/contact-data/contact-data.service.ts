import { Injectable } from '@angular/core';
import { Contact } from '../../interfaces/contact.interface'
@Injectable({
  providedIn: 'root',
})
export class ContactDataService {
  private contact : Contact;

  constructor() {}

  getContact(){
    return structuredClone(this.contact);
  }

  updateContact(contact : Contact){
    this.contact = contact;
  }
}
