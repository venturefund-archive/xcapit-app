import { Injectable } from '@angular/core';
import { Contact } from '../../interfaces/contact.interface'
@Injectable({
  providedIn: 'root',
})
export class ContactDataService {
  contact : Contact;

  constructor() {}

  getContact(){
    return this.contact ? { ...this.contact } : null;
  }

  updateContact(contact : Contact){
    this.contact = contact;
  }
}
