import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Добавьте эту строку
import { FormsModule } from '@angular/forms';   // Добавьте эту строку
import { Contact } from '../models/contact';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-contact-list',
  standalone: true, 
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
  imports: [CommonModule, FormsModule] 
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
      alert('Ошибка загрузки контактов');
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

    setTimeout(() => {
    const firstInput = document.getElementById('username') as HTMLInputElement;
    if (firstInput) firstInput.focus();
  }, 100);
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

  async saveContact(contact: Contact | null) {
    if (!contact) return;
    if (!contact.username || !contact.email || !contact.mobile) {
    alert('Пожалуйста, заполните все обязательные поля');
    return;
  }
    try {
      if (contact.id) {
        // Обновление существующего контакта
        await this.supabaseService.updateContact(contact);
        alert('Контакт обновлен!');
      } else {
        // Создание нового контакта
        await this.supabaseService.createContact(contact);
        alert('Контакт создан!');
      }
      await this.loadContacts();
      this.selectedContact = null;
    } catch (error) {
      console.error('Error saving contact:', error);
      alert('Ошибка сохранения контакта');
    }
  }
}