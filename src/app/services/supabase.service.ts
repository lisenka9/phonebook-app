// src/app/services/supabase.service.ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Contact } from '../models/contact';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // Получить все контакты
  async getContacts(): Promise<Contact[]> {
    const { data, error } = await this.supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
    return data || [];
  }

  // Создать новый контакт
  async createContact(contact: Contact): Promise<Contact> {
    const { data, error } = await this.supabase
      .from('contacts')
      .insert([{
        username: contact.username,
        email: contact.email,
        mobile: contact.mobile,
        home: contact.home
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
    return data;
  }

  // Обновить контакт
  async updateContact(contact: Contact): Promise<Contact> {
    const { data, error } = await this.supabase
      .from('contacts')
      .update({
        username: contact.username,
        email: contact.email,
        mobile: contact.mobile,
        home: contact.home
      })
      .eq('id', contact.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
    return data;
  }

  // Удалить контакт
  async deleteContact(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('contacts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }
}