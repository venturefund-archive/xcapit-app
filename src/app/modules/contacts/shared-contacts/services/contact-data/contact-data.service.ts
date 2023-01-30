import { Injectable } from '@angular/core';
import { Contact } from '../../interfaces/contact.interface'
@Injectable({
  providedIn: 'root',
})
export class ContactDataService {
  private contact : Contact;

  constructor() {}

  getContact(){
    return this.contact ? structuredClone(this.contact) : null;
  }

  updateContact(contact : Contact){
    this.contact = contact;
  }
}
