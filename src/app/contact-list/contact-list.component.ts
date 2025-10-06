import { Component, OnInit } from '@angular/core';
import { Contact } from '../models/contact';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  selectedContact: Contact | null = null;
  loading = false;

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.loadContacts();
  }

  async loadContacts() {
    this.loading = true;
    try {
      this.contacts = await this.supabaseService.getContacts();
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      this.loading = false;
    }
  }

  selectContact(contact: Contact) {
    this.selectedContact = { ...contact };
  }

  createNewContact() {
    this.selectedContact = {
      username: '',
      email: '',
      mobile: '',
      home: ''
    };
  }

  async deleteContact(id: number) {
    if (confirm('Вы уверены, что хотите удалить этот контакт?')) {
      try {
        await this.supabaseService.deleteContact(id);
        await this.loadContacts();
        this.selectedContact = null;
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  }

  async saveContact(contact: Contact) {
    try {
      if (contact.id) {
        // Обновление существующего контакта
        await this.supabaseService.updateContact(contact);
      } else {
        // Создание нового контакта
        await this.supabaseService.createContact(contact);
      }
      await this.loadContacts();
      this.selectedContact = null;
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  }
}